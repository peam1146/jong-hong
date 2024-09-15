import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOOKING_HEALTH_SERVICE_NAME } from '@jong-hong/grpc/nestjs/proto/booking/health';
import { join } from 'path';

@Module({
  imports: [HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
