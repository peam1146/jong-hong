import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}
  @Post()
  async setCache(@Body() body: { key: string; value: any }) {
    const { key, value } = body;
    await this.redisService.set(key, value);
    return { message: 'Cache set successfully' };
  }
  @Get(':key')
  async getCache(@Param('key') key: string) {
    const value = await this.redisService.get(key);
    return { key, value };
  }
  @Delete(':key')
  async deleteCache(@Param('key') key: string) {
    await this.redisService.del(key);
    return { message: 'Cache deleted successfully' };
  }
}
