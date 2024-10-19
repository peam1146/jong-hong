import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [PlaceController],
  providers: [PlaceService, DatabaseService],
})
export class PlaceModule {}
