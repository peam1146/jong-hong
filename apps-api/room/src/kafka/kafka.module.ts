import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { environment } from '../enviroment';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'room_service',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [environment.KAFKA_URL],
          },
          consumer: {
            groupId: 'room-service',
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
