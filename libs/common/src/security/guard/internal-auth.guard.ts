import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * 내부 서비스 간의 인증을 담당하는 Guard입니다.
 * 'X-Internal-API-Key' 헤더를 검사하여 FastAPI Analyzer 등
 * 신뢰할 수 있는 서비스의 요청인지 확인합니다.
 */
@Injectable()
export class InternalAuthGuard implements CanActivate {
  private readonly logger = new Logger(InternalAuthGuard.name);
  private readonly validKeys: Set<string>;

  constructor(private readonly configService: ConfigService) {
    this.validKeys = new Set();

    // .env에서 개별 키를 모두 읽어와 Set에 추가합니다.
    const platformKey = this.configService.get<string>(
      'INTERNAL_API_KEY_PLATFORM',
    );

    const analyzerKey = this.configService.get<string>(
      'INTERNAL_API_KEY_SWING_ANALYZER',
    );

    // 값이 있는 키만 Set에 추가 (undefined 방지)
    if (platformKey) {
      this.validKeys.add(platformKey);
    }

    if (analyzerKey) {
      this.validKeys.add(analyzerKey);
    }

    if (this.validKeys.size === 0) {
      this.logger.error('INTERNAL_API_KEY가 .env 파일에 설정되지 않았습니다.');
      throw new Error('INTERNAL_API_KEY가 설정되지 않았습니다.');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-internal-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    // Set에 키가 존재하는지 확인
    if (!this.validKeys.has(apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }

    // 인증 성공
    return true;
  }
}
