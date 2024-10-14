import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [RedisModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
