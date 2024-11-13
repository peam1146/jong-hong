import { PLACE_SERVICE_NAME } from '@jong-hong/grpc/nestjs/proto/room/place';
import { ROOM_SERVICE_NAME } from '@jong-hong/grpc/nestjs/proto/room/room';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { environment } from '../enviroment';
import { BookingController } from './booking.controller';
import {
  BOOKING_PACKAGE_NAME,
  BOOKING_RESERVE_SERVICE_NAME,
} from '@jong-hong/grpc/nestjs/proto/booking/reserve';

const __dirname = process.cwd();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: BOOKING_RESERVE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: environment.BOOKING_SERVICE_URL,
          package: 'booking',
          protoPath: join(
            __dirname,
            '../../packages/grpc/proto/booking/reserve.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [BookingController],
})
export class BookingModule {}
