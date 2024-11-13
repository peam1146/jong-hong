import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { PlaceModule } from './place/place.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [HealthModule, RoomModule, PlaceModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
