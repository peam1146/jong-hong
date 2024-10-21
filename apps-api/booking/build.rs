fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::compile_protos("../../packages/grpc/proto/booking/health.proto")?;
    tonic_build::compile_protos("../../packages/grpc/proto/booking/reserve.proto")?;
    Ok(())
}
