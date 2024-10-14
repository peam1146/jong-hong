import { Controller, Get } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Get('send')
  sendKafkaMessage() {
    const message = { content: 'Hello from Kafka!' };
    this.kafkaService.sendMessage('my-topic', message);
    return { status: 'Message sent to Kafka', message };
  }

  @EventPattern('my-topic')
  async handleMessage(@Payload() message) {
    console.log('Received message:', message);
  }
}
