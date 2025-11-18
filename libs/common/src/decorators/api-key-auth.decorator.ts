import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InternalAuthGuard } from '../security/guard/internal-auth.guard';
import { JwtGuard } from '@libs/common/security/guard/jwt.guard';

export function ApiKeyAuth(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    UseGuards(InternalAuthGuard),

    // swagger ui 설정
    ApiSecurity('x-internal-api-key'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
