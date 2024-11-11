import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environment } from '../enviroment';
import { JwtPayload } from './types/JWTpayload';

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
