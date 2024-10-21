import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async set(key: string, value: any, ttl: number) {
    await this.cacheManager.set(key, value, 100000);
  }
  async get(key: string) {
    return await this.cacheManager.get(key);
  }
}
