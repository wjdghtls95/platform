import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthTokenGuard } from '@libs/common/security/guard/auth-token.guard';

export function Auth(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    UseGuards(AuthTokenGuard),
    ApiBearerAuth('authToken'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
