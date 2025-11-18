import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class InternalAuthGuard implements CanActivate {
  private readonly logger = new Logger(InternalAuthGuard.name);
  private readonly internalApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.internalApiKey = this.configService.get<string>('INTERNAL_API_KEY');

    if (!this.internalApiKey) {
      throw new Error('INTERNAL_API_KEY not set');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // 헤더 키는 소문자로 자동 변환됨
    const apiKey = request.headers['x-internal-api-key'] as string;

    if (!apiKey || apiKey !== this.internalApiKey) {
      this.logger.warn(`Invalid Internal API Key attempt: ${apiKey}`);

      throw new UnauthorizedException('Invalid Internal API Key');
    }
    return true;
  }
}
