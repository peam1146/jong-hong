import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UserData } from './types/user';
import { environment } from '../enviroment';

type UserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async getJwtToken(user: UserData): Promise<string> {
    const payload = {
      ...user,
    };
    return this.jwtService.sign(payload, {
      secret: environment.JWT_SECRET,
    });
  }

  public generateUniqueKey() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeFormatted = `${hours}${minutes}${seconds}`;

    const randomChars = Math.random().toString(36).substring(2, 8);

    return `${timeFormatted}-${randomChars}`;
  }
}
