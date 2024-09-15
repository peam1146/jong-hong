import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOOKING_HEALTH_SERVICE_NAME } from '@jong-hong/grpc/nestjs/proto/booking/health';
import { join } from 'path';

const __dirname = process.cwd();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: BOOKING_HEALTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: 'booking',
          protoPath: join(__dirname, process.env.BOOKING_GRPC_PROTO_PATH),
        },
      },
    ]),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
