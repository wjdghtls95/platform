import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@libs/common/security/guard/jwt.guard';
import { ApiBasicAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    UseGuards(JwtGuard),
    // ApiBasicAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
