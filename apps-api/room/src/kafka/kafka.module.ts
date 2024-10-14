import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'room_service',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'room-service',
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  controllers: [KafkaController],
  exports: [KafkaService],
})
export class KafkaModule {}
