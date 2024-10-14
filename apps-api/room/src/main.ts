import { NestFactory } from '@nestjs/core';
import {
  type GrpcOptions,
  type KafkaOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { environment } from './enviroment';

const __dirname = process.cwd();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: `127.0.0.1:${environment.PORT}`,
      package: 'booking',
      protoPath: join(
        __dirname,
        '../../packages/grpc/proto/booking/health.proto',
      ),
    },
  });

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'room-service',
      },
    },
  });

  await app.startAllMicroservices();

  // await app.listen(8000);
}
if (process.env.IS_BUILDING !== 'true') bootstrap();
