import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { OAuthUserDto } from '@libs/dao/platform/auth/dto/oauth-login.dto';

@Injectable()
export class OAuthGuard extends AuthGuard('google') implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      // DTO 변환
      request.user = new OAuthUserDto();

      request.user.email = user.email;
      request.user.name = user.displayName;
      request.user.providerId = user.id;
    }

    return super.canActivate(context);
  }
}
