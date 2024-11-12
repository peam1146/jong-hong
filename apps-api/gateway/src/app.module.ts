import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PenaltyModule } from './penalty/penalty.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [HealthModule, AuthModule, RoomModule, PenaltyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
