import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_SECRET_KEY } from '@libs/common/constants/token.constants';
import { AuthPayload } from '@libs/dao/auth/interfaces/auth-payload.interface';
import { TokenUtil } from '@libs/common/utils/token.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ACCESS_TOKEN_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(authPayload: AuthPayload): Promise<AuthPayload> {
    return authPayload;
  }
}
