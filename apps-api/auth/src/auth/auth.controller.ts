import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../redis/redis.service';
import { Response } from 'express';
import { JWTAuthGuard } from './guards/auth.guard';
import { KafkaService } from '../kafka/kafka.service';
import { environment } from '../enviroment';
import { UserService } from '../user/user.service';
import { JwtPayload } from './types/JWTpayload';
import { User } from '../schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return req;
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user: User = { ...req.user };
    const payload: JwtPayload = { id: user._id };

    const token = await this.authService.getJwtToken(payload);

    // const exp = 7 * 24 * 60 * 60 * 1000;
    // await this.redisService.set(payload.id, token, exp);

    const existUser = await this.userService.findById(user._id);
    if (existUser === null) {
      await this.userService.create(req.user);
    }

    return res
      .status(HttpStatus.OK)
      .redirect(`http://localhost:8000?token=${token}`);
  }

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  async getProfile(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user: User = await this.userService.findById(req.payload.id);
    return user;
  }
}
