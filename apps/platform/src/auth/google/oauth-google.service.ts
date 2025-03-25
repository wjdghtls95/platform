import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { OAuthGoogleInfo } from './interface/oauth-google-info.interface';
import googleConfig from './config/google.config';
import { ServerErrorException } from '@libs/common/exception/server-errror.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { GetPlatformTokenOutDto } from '@libs/dao/auth/dto/get-platform-token-out.dto';

@Injectable()
export class OAuthGoogleService {
  constructor(private readonly oauth2Client: OAuth2Client) {}

  /**
   * platform id 발급
   */
  async getPlatformToken(code: string): Promise<GetPlatformTokenOutDto> {
    const google = new OAuth2Client(
      googleConfig().webClientId,
      googleConfig().webClientSecret,
      googleConfig().webRedirectUri,
    );

    try {
      const { tokens } = await google.getToken(code);

      return GetPlatformTokenOutDto.of({ platformToken: tokens.id_token });
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.OAUTH_GOOGLE_CODE_INVALID,
      );
    }
  }

  /**
   * IDP 인증 (Identity Provider)
   */
  async verifyPlatformToken(idToken: string): Promise<OAuthGoogleInfo> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: idToken,
        audience: [
          googleConfig().webClientId,
          googleConfig().webClientSecret,
          googleConfig().webRedirectUri,
        ],
      });

      return {
        providerId: ticket.getPayload().sub,
        email: ticket.getPayload().email,
      };
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.OAUTH_GOOGLE_ID_TOKEN_INVALID,
      );
    }
  }
}
