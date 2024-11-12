import { PENALTY_GAPI_SERVICE_NAME } from '@jong-hong/grpc/nestjs/proto/penalty/penalty';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { PenaltyController } from './penalty.controller';

import { environment } from '../enviroment';

const __dirname = process.cwd();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PENALTY_GAPI_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: environment.PENALTY_SERVICE_URL,
          package: 'penalty',
          protoPath: join(
            __dirname,
            '../../packages/grpc/proto/penalty/penalty.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [PenaltyController],
})
export class PenaltyModule {}
