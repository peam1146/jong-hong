import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { environment } from '../../enviroment';

import { Injectable } from '@nestjs/common';
import { User } from '../../schemas/user.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: environment.GOOGLE_CLIENT_ID,
      clientSecret: environment.GOOGLE_SECRET,
      callbackURL: 'http://localhost:8000/auth/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;
    const user: User = {
      _id: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
    };
    done(null, user);
  }
}
