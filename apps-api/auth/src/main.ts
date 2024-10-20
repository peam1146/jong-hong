import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  GrpcOptions,
  KafkaOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { environment } from './enviroment';
import cookieParser from 'cookie-parser';


const __dirname = process.cwd();

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [environment.KAFKA_URL],
      },
      consumer: {
        groupId: 'auth-service',
      },
    },
  });

  app.use(cookieParser());

  await app.startAllMicroservices();

  await app.listen(environment.PORT);
}

bootstrap();
