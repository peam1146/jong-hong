import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { environment } from './enviroment';

const __dirname = process.cwd();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${environment.GRPC_PORT}`,
      package: 'room',
      protoPath: [
        '/app/packages/grpc/proto/room/room.proto',
        '/app/packages/grpc/proto/room/place.proto',
        '/app/packages/grpc/proto/room/health.proto',
        // join(__dirname, '../../packages/grpc/proto/room/room.proto'),
        // join(__dirname, '../../packages/grpc/proto/room/place.proto'),
        // join(__dirname, '../../packages/grpc/proto/room/health.proto'),
      ],
    },
    logger: ['error', 'warn', 'debug', 'verbose'],
  });

  // app.connectMicroservice<KafkaOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: [environment.BROKER_URL],
  //     },
  //     consumer: {
  //       groupId: 'room-service',
  //     },
  //   },
  // });

  await app.listen();
  console.log('Room service is running');
}
if (process.env.IS_BUILDING !== 'true') bootstrap();
