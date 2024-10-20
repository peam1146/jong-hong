import {
  Controller,
  Get,
  HttpStatus,
  Inject,
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
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
    const token = await this.authService.getJwtToken(req.user);
    const key = this.authService.generateUniqueKey();
    const exp = 7 * 24 * 60 * 60 * 1000;
    res.cookie('token-id', key, {
      domain: environment.SERVER_DOMAIN,
      httpOnly: true,
      secure: true,
      maxAge: exp,
    });
    await this.redisService.set(key, token, exp);

    return res.status(HttpStatus.OK).json({
      message: 'Login Success',
      user: req.user,
    });
  }

  @Get('logout')
  @UseGuards(JWTAuthGuard)
  async googleLogout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const key = req.cookies['token-id'];
    await this.redisService.set(key, '', 0);

    res.cookie('token-id', '', {
      domain: environment.SERVER_DOMAIN,
      httpOnly: true,
      secure: true,
      maxAge: -1,
    });

    return res.status(HttpStatus.OK).json({
      message: 'Logout success',
    });
  }

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  async getProfile(@Req() req, @Res({ passthrough: true }) res: Response) {
    return res.status(HttpStatus.OK).json({
      user: req.user,
    });
  }
}
