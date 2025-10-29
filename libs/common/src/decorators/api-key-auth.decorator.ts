import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InternalAuthGuard } from '../security/guard/internal-auth.guard';

export function ApiKeyAuth(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    UseGuards(InternalAuthGuard),
    ApiBearerAuth('authToken'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
