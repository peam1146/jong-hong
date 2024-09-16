import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { environment } from './enviroment';

const __dirname = process.cwd();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    options: {
      url: environment.BOOKING_GRPC_URL,
      package: 'booking',
      protoPath: join(
        __dirname,
        '../../packages/grpc/proto/booking/health.proto',
      ),
    },
  });

  await app.listen(environment.PORT);
}

if (process.env.IS_BUILDING !== 'true') bootstrap();
