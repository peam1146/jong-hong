import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { environment } from './enviroment';

const __dirname = process.cwd();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.connectMicroservice<GrpcOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     url: environment.AUTH_SERVICE_URL,
  //     package: 'room',
  //     protoPath: [
  //       join(__dirname, '../../packages/grpc/proto/room/room.proto'),
  //       join(__dirname, '../../packages/grpc/proto/room/place.proto'),
  //     ],
  //   },
  // });

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

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(environment.PORT);
}

if (process.env.IS_BUILDING !== 'true') bootstrap();
