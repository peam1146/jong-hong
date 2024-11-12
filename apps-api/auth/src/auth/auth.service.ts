import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { JwtPayload } from './types/JWTpayload';

import { environment } from '../enviroment';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async getJwtToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(
      { ...payload },
      {
        secret: environment.JWT_SECRET,
      },
    );
  }
}
