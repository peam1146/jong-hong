import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { RoomModule } from './room/room.module';
import { PlaceModule } from './place/place.module';
import { KafkaModule } from './kafka/kafka.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [HealthModule, RoomModule, PlaceModule, KafkaModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
