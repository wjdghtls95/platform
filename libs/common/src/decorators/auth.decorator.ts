import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@libs/common/security/guard/jwt.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    UseGuards(JwtGuard),
    ApiBearerAuth('access-token'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
