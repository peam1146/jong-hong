import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';

const __dirname = process.cwd();

@Module({
  imports: [],
  controllers: [AuthController],
})
export class AuthModule {}
