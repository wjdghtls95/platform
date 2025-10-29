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
  private readonly validKey: string;

  constructor(private configService: ConfigService) {
    this.validKey = this.configService.get<string>('INTERNAL_API_KEY');
    if (!this.validKey) {
      this.logger.error('INTERNAL_API_KEY가 .env 파일에 설정되지 않았습니다.');
      throw new Error('INTERNAL_API_KEY가 설정되지 않았습니다.');
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-internal-api-key'] as string;

    // 헤더의 키와 .env의 키를 비교
    if (!apiKey || apiKey !== this.validKey) {
      this.logger.warn(
        `비인가 접근 시도: ${request.ip}, Key: ${apiKey?.substring(0, 5)}...`,
      );
      // 키가 없거나 일치하지 않으면 401 Unauthorized 에러 발생
      throw new UnauthorizedException('유효하지 않은 내부 API 키입니다.');
    }

    // 인증 성공
    return true;
  }
}
