import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('auth-service') private readonly clientKafka: ClientKafka,
  ) {}

  sendMessage(topic: string, payload: any) {
    return this.clientKafka.emit(topic, payload);
  }
}
