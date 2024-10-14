import { Body, Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly producerService: ProducerService) {}

  @Get('send')
  sendKafkaMessage(@Body() body: { topic: string; message: any }) {
    if (body.topic == '') {
      return { status: 'Require: Topic' };
    }

    const { topic, message } = body;

    this.producerService.sendMessage(topic, message);
    return { status: 'Message sent to Kafka', message };
  }

  @EventPattern('my-topic')
  async handleMessage(@Payload() message) {
    console.log('Received message:', message);
  }
}
