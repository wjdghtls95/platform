import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { SecurityService } from '@libs/common/security/security.service';

@Injectable()
export class InternalApiKeyStrategy extends PassportStrategy(
  Strategy,
  'internal-api-key',
) {
  private readonly logger = new Logger(InternalApiKeyStrategy.name);

  constructor(private readonly securityService: SecurityService) {
    super(
      { header: 'X-Internal-Api-Key', prefix: '' },
      true,
      (apiKey: string, done: (error: Error | null, data?: any) => void) => {
        return this.validate(apiKey, done);
      },
    );
  }

  validate(
    apiKey: string,
    done: (error: Error | null, data?: any) => void,
  ): void {
    if (this.securityService.validateInternalApiKey(apiKey)) {
      this.logger.debug('Valid internal API key');
      done(null, true);
      return;
    }

    this.logger.warn(`Invalid internal API key: ${apiKey?.substring(0, 8)}...`);
    done(new UnauthorizedException('Invalid internal API key'), null);
  }
}
