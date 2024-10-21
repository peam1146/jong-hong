use booking::booking_health_service_server::{BookingHealthService, BookingHealthServiceServer};
use booking::booking_reserve_service_server::{BookingReserveService, BookingReserveServiceServer};
use booking::{BookingRequest, BookingResponse, PingRequest, PingResponse};
use tonic::{transport::Server, Request, Response, Status};
pub mod booking {
    tonic::include_proto!("health"); // The string specified here must match the proto package name
    tonic::include_proto!("booking");
}

#[derive(Default, Debug)]
struct BookingHealthServiceServerImpl {}

#[tonic::async_trait]
impl BookingHealthService for BookingHealthServiceServerImpl {
    async fn ping(&self, request: Request<PingRequest>) -> Result<Response<PingResponse>, Status> {
        Ok(Response::new(PingResponse {
            message: format!("Hello, {}!", request.into_inner().message),
        }))
    }
}

#[derive(Default, Debug)]
struct BookingReserveServiceImpl {}

#[tonic::async_trait]
impl BookingReserveService for BookingReserveServiceImpl {
    async fn booking(
        &self,
        request: Request<BookingRequest>,
    ) -> Result<Response<BookingResponse>, Status> {
        Ok(Response::new(BookingResponse {
            booking_id: String::from("1"),
        }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let health = BookingHealthServiceServerImpl::default();

    Server::builder()
        .add_service(BookingHealthServiceServer::new(health))
        .serve(addr)
        .await?;

    Ok(())
}
