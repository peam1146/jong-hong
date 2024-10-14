import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      isGlobal: true,
      host: 'localhost',
      port: 6379,
    }),
  ],
  providers: [RedisService],
  controllers: [RedisController],
})
export class RedisModule {}
