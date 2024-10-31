import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  GrpcOptions,
  KafkaOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { environment } from './enviroment';

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

  await app.startAllMicroservices();

  await app.listen(environment.PORT);
}

bootstrap();
