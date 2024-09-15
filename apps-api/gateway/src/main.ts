import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

const __dirname = process.cwd();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    options: {
      url: 'localhost:50051',
      package: 'booking',
      protoPath: join(
        __dirname,
        '../../packages/grpc/proto/booking/health.proto',
      ),
    },
  });

  await app.listen(3000);
}
bootstrap();
