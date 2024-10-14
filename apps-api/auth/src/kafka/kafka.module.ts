import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerService } from './producer.service';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'auth-service',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-service',
          },
        },
      },
    ]),
  ],
  providers: [ProducerService],
  controllers: [KafkaController],
  exports: [ProducerService],
})
export class KafkaModule {}
