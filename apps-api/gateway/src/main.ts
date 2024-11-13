import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { environment } from './enviroment';
import { Transport } from '@nestjs/microservices';

const __dirname = process.cwd();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [environment.MESSAGE_BROKER_URL],
      },
      consumer: {
        groupId: 'gateway-consumer',
      },
    },
  });
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(environment.PORT);
}

if (process.env.IS_BUILDING !== 'true') bootstrap();
