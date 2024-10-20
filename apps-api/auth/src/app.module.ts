import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RedisModule, KafkaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
