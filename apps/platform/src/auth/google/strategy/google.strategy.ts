import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import googleConfig from '../config/google.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: googleConfig().webClientId.toString(),
      callbackURL: googleConfig().webRedirectUri.toString(),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails } = profile;

    const user = {
      accessToken: accessToken,
      providerId: id,
      name: displayName,
      emails: emails[0].value,
    };

    done(null, user);
  }
}
