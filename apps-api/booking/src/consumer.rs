use std::time::Duration;

use rdkafka::config::ClientConfig;
use rdkafka::consumer::{Consumer, StreamConsumer};
use rdkafka::message::{BorrowedMessage, Message, OwnedHeaders};
use rdkafka::producer::{FutureProducer, FutureRecord};
use tokio_stream::StreamExt;

use crate::service;
use crate::service::bookings::{BookingFailedResponse, BookingSuccessResponse};

pub struct ConsumerWarpper {
    consumer: StreamConsumer,
    publisher: FutureProducer,
}

const BOOKING_REQUESTED_TOPIC: &str = "booking.requested";
const BOOKING_CANCELED_TOPIC: &str = "booking.canceled";

const BOOKING_REQUESTED_SUCCESS_TOPIC: &str = "booking.requested.success";
const BOOKING_REQUESTED_FAILED_TOPIC: &str = "booking.requested.failed";

const BOOKING_CANCELED_SUCCESS_TOPIC: &str = "booking.canceled.success";
const BOOKING_CANCELED_FAILED_TOPIC: &str = "booking.canceled.failed";

impl ConsumerWarpper {
    pub fn new(broker: &str, topics: Vec<&str>, group_id: &str) -> Self {
        let consumer: StreamConsumer = ClientConfig::new()
            .set("bootstrap.servers", broker)
            .set("group.id", group_id)
            .set("auto.offset.reset", "earliest")
            .create()
            .expect("Consumer creation failed");

        consumer
            .subscribe(&topics)
            .expect("Subscribing to topic failed");

        let publisher: FutureProducer = ClientConfig::new()
            .set("bootstrap.servers", broker)
            .set("message.timeout.ms", "5000")
            .create()
            .expect("Producer creation error");

        ConsumerWarpper {
            consumer,
            publisher,
        }
    }

    pub async fn consume_messages(&self, booking_service: &service::bookings::BookingService) {
        let mut stream = self.consumer.stream();

        while let Some(result) = stream.next().await {
            match result {
                Ok(message) => {
                    let payload = match message.payload_view::<str>() {
                        Some(Ok(payload)) => payload,
                        Some(Err(e)) => {
                            eprintln!("Error while deserializing message payload: {:?}", e);
                            continue;
                        }
                        None => {
                            eprintln!("Failed to get message payload");
                            continue;
                        }
                    };

                    match message.topic().as_ref() {
                        BOOKING_REQUESTED_TOPIC => {
                            match serde_json::from_str::<service::bookings::BookingRequest>(payload)
                            {
                                Ok(booking_request) => {
                                    println!(
                                        "From topic {}, Received chat message: {:?}",
                                        message.topic(),
                                        booking_request
                                    );
                                    match booking_service.booking(&booking_request).await {
                                        Ok(resp) => {
                                            if let Ok(resp) = serde_json::to_string(&resp) {
                                                self.publisher
                                                    .send(
                                                        FutureRecord::to(
                                                            BOOKING_REQUESTED_SUCCESS_TOPIC,
                                                        )
                                                        .payload(&resp),
                                                        Duration::from_secs(0),
                                                    )
                                                    .await
                                            } else {
                                                self.publisher
                                                    .send(
                                                        FutureRecord::to(
                                                            BOOKING_REQUESTED_SUCCESS_TOPIC,
                                                        ),
                                                        Duration::from_secs(0),
                                                    )
                                                    .await
                                            }
                                        }
                                        Err(resp) => {
                                            self.publisher
                                                .send(
                                                    FutureRecord::to(
                                                        BOOKING_REQUESTED_FAILED_TOPIC,
                                                    )
                                                    .payload(&resp.into()),
                                                    Duration::from_secs(0),
                                                )
                                                .await
                                        }
                                    };
                                }
                                Err(e) => {
                                    eprintln!("Error while deserializing message payload: {:?}", e);
                                    continue;
                                }
                            }
                        }
                        BOOKING_CANCELED_TOPIC => {
                            match serde_json::from_str::<
                                service::bookings::BookingCancellationRequest,
                            >(payload)
                            {
                                Ok(booking_canceled) => {
                                    match booking_service
                                        .cancel_booking(
                                            &service::bookings::BookingCancellationRequest {
                                                booking_id: booking_canceled.booking_id,
                                            },
                                        )
                                        .await
                                    {
                                        Ok(_) => {
                                            println!("Booking cancellation successful");
                                        }
                                        Err(e) => {
                                            eprintln!("Failed to cancel booking: {:?}", e);
                                        }
                                    }
                                }
                                Err(e) => {
                                    eprintln!("Error while deserializing message payload: {:?}", e);
                                    continue;
                                }
                            }
                        }
                        _ => {
                            eprintln!("Received message from unknown topic: {}", message.topic());
                        }
                    }
                }
                Err(error) => {
                    eprintln!("Panda error: {}", error);
                }
            }
        }
    }
}
