import { Injectable } from '@nestjs/common';
import { AccessToken, TokenUtil } from '@libs/common/utils/token.util';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class SecurityService {
  /**
   * authToken validate
   */
  validateAuthToken(authToken: string): AccessToken {
    try {
      return TokenUtil.decodeAccessToken(authToken);
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.API_SECURITY_AUTH_TOKEN_INVALIDATE,
      );
    }
  }
}
