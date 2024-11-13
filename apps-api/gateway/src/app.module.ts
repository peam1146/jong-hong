import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { PenaltyModule } from './penalty/penalty.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [AuthModule, RoomModule, PenaltyModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
