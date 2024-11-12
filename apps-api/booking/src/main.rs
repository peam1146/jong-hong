mod admin;
mod config;
mod consumer;
mod db;
mod entity;
mod service;
use booking::booking_reserve_service_server::{BookingReserveService, BookingReserveServiceServer};
use service::bookings::BookingService;
use tonic::{transport::Server, Request, Response, Status};

pub mod booking {
    tonic::include_proto!("booking");
}

struct BookingReserveServiceImpl {
    service: Box<BookingService>,
}

#[tonic::async_trait]
impl BookingReserveService for BookingReserveServiceImpl {
    async fn get_room_bookings(
        &self,
        request: Request<booking::GetRoomBookingsRequest>,
    ) -> Result<Response<booking::GetRoomBookingsResponse>, Status> {
        todo!()
    }

    async fn get_room_details(
        &self,
        request: Request<booking::GetRoomDetailsRequest>,
    ) -> Result<Response<booking::GetRoomDetailsResponse>, Status> {
        todo!()
    }

    async fn get_user_bookings(
        &self,
        request: Request<booking::GetUserBookingsRequest>,
    ) -> Result<Response<booking::GetUserBookingsResponse>, Status> {
        todo!()
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let brokers = "localhost:19092";
    let topic = "booking_requested";

    let addr = "[::1]:50051".parse().unwrap();

    let admin = admin::Admin::new(brokers);

    let db_instance = db::init().await?;

    match db_instance.ping().await {
        Ok(_) => println!("Database connection established"),
        Err(e) => {
            eprintln!("Failed to connect to database: {:?}", e);
            return Ok(());
        }
    }

    let booking_service = service::bookings::BookingService::new(db_instance);

    let booking_reserve = BookingReserveServiceImpl {
        service: Box::new(booking_service.clone()),
    };

    let exists = admin.topic_exists(topic).await?;
    if exists {
        println!("Topic {} already exists", topic);
    } else if let Err(err) = admin.create_topic(topic).await {
        eprintln!("Failed to create topic {}: {:?}", topic, err);
    }

    let consumer = consumer::ConsumerWarpper::new(&brokers, vec![topic], "1");

    let server = Server::builder()
        .add_service(BookingReserveServiceServer::new(booking_reserve))
        .serve(addr);

    let consumer_handle = tokio::task::spawn(async move {
        consumer.consume_messages(&booking_service).await;
    });

    let _ = tokio::join!(consumer_handle, server);

    Ok(())
}
