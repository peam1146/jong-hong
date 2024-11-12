use std::collections::HashMap;

use sea_orm::{
    prelude::DateTimeUtc, ColumnTrait, Condition, DatabaseConnection, EntityTrait, QueryFilter, Set,
};
use serde::{Deserialize, Serialize};
// use sea_orm::sea_query::{pre}

use crate::entity::{self};

#[derive(Clone)]
pub struct BookingService {
    db: DatabaseConnection,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BookingRequest {
    pub room_id: String,
    pub user_id: String,
    pub booking_id: String,
    pub check_in: DateTimeUtc,
    pub check_out: DateTimeUtc,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BookingSuccessResponse {
    pub booking_id: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BookingFailedResponse {
    pub booking_id: String,
    pub reason: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BookingCancellationRequest {
    pub booking_id: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GetBookingsByAvailabilityRequest {
    pub room_ids: Vec<String>,
    pub available_from: DateTimeUtc,
    pub available_to: DateTimeUtc,
}

impl BookingService {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    async fn check_is_room_available(
        &self,
        room_id: &str,
        check_in: DateTimeUtc,
        check_out: DateTimeUtc,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        // (check_in >= check_in && check_in < check_out) || (check_out > check_in && check_out <= check_out)
        let conn = &self.db;
        let bookings_in_preriod_async = entity::bookings::Entity::find()
            .filter(
                Condition::any()
                    .add(
                        entity::bookings::Column::CheckIn
                            .gte(check_in)
                            .and(entity::bookings::Column::CheckIn.lt(check_out)),
                    )
                    .add(
                        entity::bookings::Column::CheckOut
                            .gt(check_in)
                            .and(entity::bookings::Column::CheckOut.lte(check_out)),
                    )
                    .add(entity::bookings::Column::RoomId.eq(room_id)),
            )
            .all(conn);
        let room_config_async = entity::room_configs::Entity::find_by_id(room_id).one(conn);

        match tokio::join!(bookings_in_preriod_async, room_config_async) {
            (Ok(bookings_result), Ok(room_config_result)) => {
                let config: entity::room_configs::Model = match room_config_result {
                    Some(config) => config,
                    None => return Err("Room not found".into()),
                };
                Ok(bookings_result.len() < config.max_occupancy as usize)
            }
            _ => Err("Failed to check room availability".into()),
        }
    }

    pub async fn booking(
        &self,
        bookings: &BookingRequest,
    ) -> Result<BookingSuccessResponse, BookingFailedResponse> {
        if let Err(_) = self
            .check_is_room_available(&bookings.room_id, bookings.check_in, bookings.check_out)
            .await
        {
            return Err(BookingFailedResponse {
                booking_id: bookings.booking_id.clone(),
                reason: "Room is not available".to_string(),
            });
        }
        println!("Room is available");

        let booking = entity::bookings::ActiveModel {
            booking_id: Set(bookings.booking_id.clone()),
            room_id: Set(bookings.room_id.clone()),
            user_id: Set(bookings.user_id.clone()),
            check_in: Set(bookings.check_in.naive_utc()),
            check_out: Set(bookings.check_out.naive_utc()),
            ..Default::default()
        };

        let result = match entity::bookings::Entity::insert(booking)
            .exec(&self.db)
            .await
        {
            Ok(res) => res,
            Err(msg) => {
                return Err(BookingFailedResponse {
                    booking_id: bookings.booking_id.clone(),
                    reason: msg.to_string(),
                })
            }
        };

        Ok(BookingSuccessResponse {
            booking_id: result.last_insert_id,
        })
    }

    pub async fn cancel_booking(
        &self,
        booking_cancellation: &BookingCancellationRequest,
    ) -> Result<(), Box<dyn std::error::Error>> {
        entity::bookings::Entity::delete_by_id(booking_cancellation.booking_id.clone())
            .exec(&self.db)
            .await?;
        Ok(())
    }

    pub async fn get_bookings_by_availability(
        &self,
        bookings: &GetBookingsByAvailabilityRequest,
    ) -> Result<Vec<String>, Box<dyn std::error::Error>> {
        let conn = &self.db;
        let bookings_in_preriod_async = entity::bookings::Entity::find()
            .filter(
                Condition::any()
                    .add(
                        entity::bookings::Column::CheckIn
                            .gte(bookings.available_from)
                            .and(entity::bookings::Column::CheckIn.lt(bookings.available_to)),
                    )
                    .add(
                        entity::bookings::Column::CheckOut
                            .gt(bookings.available_from)
                            .and(entity::bookings::Column::CheckOut.lte(bookings.available_to)),
                    )
                    .add(entity::bookings::Column::RoomId.is_in(bookings.room_ids.clone())),
            )
            .all(conn);

        let room_configs_async = entity::room_configs::Entity::find()
            .filter(entity::room_configs::Column::RoomId.is_in(bookings.room_ids.clone()))
            .all(conn);

        match tokio::join!(bookings_in_preriod_async, room_configs_async) {
            (Ok(bookings_result), Ok(configs)) => {
                let mut available_rooms = Vec::new();

                let hashmap_room_configs: HashMap<String, entity::room_configs::Model> = configs
                    .into_iter()
                    .map(|config| (config.room_id.clone(), config))
                    .collect();

                for room_id in bookings.room_ids.iter() {
                    if let Some(config) = hashmap_room_configs.get(room_id) {
                        let occupied = bookings_result
                            .iter()
                            .filter(|b| b.room_id == *room_id)
                            .count();
                        if occupied < config.max_occupancy as usize {
                            available_rooms.push(room_id.clone());
                        }
                    }
                }

                Ok(available_rooms)
            }
            _ => Err("Failed to fetch bookings or room configs".into()),
        }
    }
}
