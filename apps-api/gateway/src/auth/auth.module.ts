import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';

const __dirname = 'apps-api/gateway';

@Module({
  imports: [],
  controllers: [AuthController],
})
export class AuthModule {}
