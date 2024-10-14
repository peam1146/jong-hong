use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::Arc;

use booking::booking_health_service_server::{BookingHealthService,BookingHealthServiceServer};
use booking::{PingRequest, PingResponse};
use tonic::{transport::Server, Request, Response, Status};
pub mod booking {
    tonic::include_proto!("booking"); // The string specified here must match the proto package name
}

#[derive(Default, Debug)]
struct BookingHealthServiceServerImpl {
    counter: Arc<AtomicU32>,
}

#[tonic::async_trait]
impl BookingHealthService for BookingHealthServiceServerImpl {
    async fn ping(
        &self,
        request: Request<PingRequest>,
    ) -> Result<Response<PingResponse>, Status> {
        println!("Got a request: {:?}", request);

        // let counter =  match self.counter.lock() {
        //     Ok(c) => c,
        //     Err(_) => return Err(Status::internal("Failed to lock counter")),
        // };

        self.counter.fetch_add(1, Ordering::Relaxed);

        let response = PingResponse{
            message: format!("Hello, {}!, with counte: {}!", request.into_inner().message, self.counter.load(Ordering::Relaxed)),
        };

        Ok(Response::new(response))
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
