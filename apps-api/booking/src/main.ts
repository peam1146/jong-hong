import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { type GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const __dirname = process.cwd();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:50051',
      package: 'booking',
      protoPath: join(
        __dirname,
        '../../packages/grpc/proto/booking/health.proto',
      ),
    },
  });
  app.listen();
}
bootstrap();
