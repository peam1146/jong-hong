import { BOOKING_RESERVE_SERVICE_NAME } from '@jong-hong/grpc/nestjs/proto/booking/reserve';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { BookingController } from './booking.controller';

import { environment } from '../enviroment';

const __dirname = 'apps-api/gateway';

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
