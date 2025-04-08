import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPayload } from '@libs/dao/auth/interfaces/auth-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthPayload => {
    const request = ctx.switchToHttp().getRequest();

    return request.user; // JwtStrategy.validate()에서 리턴한 값
  },
);
