import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

const __dirname = process.cwd();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    options: {
      url: process.env.BOOKING_GRPC_URL,
      package: 'booking',
      protoPath: join(__dirname, process.env.BOOKING_GRPC_PROTO_PATH),
    },
  });

  await app.listen(3000);
}
bootstrap();
