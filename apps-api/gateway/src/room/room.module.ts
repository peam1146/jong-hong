import { PLACE_SERVICE_NAME } from '@jong-hong/grpc/nestjs/proto/room/place';
import { ROOM_SERVICE_NAME } from '@jong-hong/grpc/nestjs/proto/room/room';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { RoomController } from './room.controller';

import { environment } from '../enviroment';

const __dirname = 'apps-api/gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ROOM_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: environment.ROOM_SERVICE_URL,
          package: 'room',
          protoPath: join(
            __dirname,
            '../../packages/grpc/proto/room/room.proto',
          ),
        },
      },
      {
        name: PLACE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: environment.ROOM_SERVICE_URL,
          package: 'room',
          protoPath: join(
            __dirname,
            '../../packages/grpc/proto/room/place.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [RoomController],
})
export class RoomModule {}
