import { AuthPayload } from '@libs/dao/auth/interfaces/auth-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { SecurityService } from '../security.service';
import { TokenUtil } from '@libs/common/utils/token.util';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(Strategy, 'authToken') {
  constructor() {
    super({ header: 'authToken', prefix: '' }, true, (authToken, done) => {
      return this.validate(authToken, done);
    });
  }

  validate(
    authToken: string,
    done: (error: Error | null, data: AuthPayload | null) => void,
  ): void {
    try {
      const payload = TokenUtil.decodeAccessToken(authToken);

      if (!payload?.userId) {
        throw new UnauthorizedException();
      }

      const result: AuthPayload = {
        userId: payload.userId,
      };

      done(null, result);
    } catch (e) {
      done(
        new ServerErrorException(
          INTERNAL_ERROR_CODE.API_SECURITY_AUTH_TOKEN_INVALIDATE,
        ),
        null,
      );
    }
  }
}

// @Injectable()
// export class AuthTokenStrategy extends PassportStrategy(Strategy, 'authToken') {
//   constructor(private securityService: SecurityService) {
//     super({ header: 'authToken', prefix: '' }, true, (authToken, done) => {
//       return this.validate(authToken, done);
//     });
//   }
//
//   validate(
//     authToken: string,
//     done: (error: Error, data: any) => NonNullable<unknown>,
//   ): void {
//     if (this.securityService.validateAuthToken(authToken)) {
//       done(null, true);
//     }
//
//     done(new UnauthorizedException(), null);
//   }
// }
