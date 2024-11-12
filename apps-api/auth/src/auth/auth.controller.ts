import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { JWTAuthGuard } from './guards/auth.guard';
import type { JwtPayload } from './types/JWTpayload';

import { environment } from '../enviroment';
import { User } from '../schemas/user.schema';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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

    const existUser = await this.userService.findById(user._id);
    if (existUser === null) {
      await this.userService.create(req.user);
    }

    return res
      .status(HttpStatus.OK)
      .redirect(`${environment.REDIRECT_URL}?token=${token}`);
  }

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  async getProfile(@Req() req, @Res({ passthrough: true }) res: Response) {
    console.log(req.payload);
    const user: User = await this.userService.findById(req.payload.id);
    return user;
  }
}
