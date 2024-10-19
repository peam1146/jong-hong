import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, DatabaseService],
})
export class RoomModule {}
