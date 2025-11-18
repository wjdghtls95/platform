import { Injectable, Logger } from '@nestjs/common';
import { AccessToken, TokenUtil } from '@libs/common/utils/token.util';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private readonly internalApiKeys: Set<string> = new Set();

  constructor(private readonly configService: ConfigService) {
    this.initializeInternalApiKeys();
  }

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

  /***
   * internal api key validate
   */
  validateInternalApiKey(internalApiKey: string): boolean {
    return this.internalApiKeys.has(internalApiKey);
  }

  /**
   * internal key 초기화
   */
  private initializeInternalApiKeys(): void {
    const platformKey = this.configService.get<string>(
      'INTERNAL_API_KEY_PLATFORM',
    );
    const analyzerKey = this.configService.get<string>(
      'INTERNAL_API_KEY_SWING_ANALYZER',
    );

    if (platformKey) {
      this.internalApiKeys.add(platformKey);
      this.logger.log('Platform internal API key loaded');
    }
    if (analyzerKey) {
      this.internalApiKeys.add(analyzerKey);
      this.logger.log('Swing Analyzer internal API key loaded');
    }

    if (this.internalApiKeys.size === 0) {
      this.logger.warn('No internal API keys configured');
    }
  }
}
