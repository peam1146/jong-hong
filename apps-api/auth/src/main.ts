import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { environment } from './enviroment';

const __dirname = process.cwd();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [environment.BROKER_URI],
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
