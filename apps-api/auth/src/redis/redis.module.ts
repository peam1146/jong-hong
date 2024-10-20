import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { environment } from '../enviroment';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      isGlobal: true,
      host: 'localhost',
      port: environment.REDIS_PORT,
    }),
  ],
  providers: [RedisService],
})
export class RedisModule {}
