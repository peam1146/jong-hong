import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOOKING_HEALTH_SERVICE_NAME } from '@jong-hong/grpc/nestjs/proto/booking/health';
import { join } from 'path';
import { environment } from 'src/enviroment';

const __dirname = process.cwd();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: BOOKING_HEALTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: environment.BOOKING_GRPC_URL,
          package: 'booking',
          protoPath: join(
            __dirname,
            '../../packages/grpc/proto/booking/health.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}