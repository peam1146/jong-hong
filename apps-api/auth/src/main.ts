import { NestFactory } from '@nestjs/core';
import { KafkaOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { environment } from './enviroment';

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
  await app.listen(environment.PORT, () => {
    console.log(`Auth service is running on ${environment.PORT}`);
  });
}

if (process.env.IS_BUILDING !== 'true') bootstrap();
