import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { JWT_GUARD_EXCLUDE_PATH } from '@libs/common/constants/token.constants';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { path } = request;

    /**
     * TODO.. 만약 쿼리스트링으로 들어 온다면??
     * some() 메서드로 Prefix 확인해서 하면 될듯
     */
    // 헬스 체크, 로그인, 회원가입은 jwtGuard 에서 인증 없이 접근 가능
    if (JWT_GUARD_EXCLUDE_PATH.includes(path)) {
      return true;
    }

    return super.canActivate(context); // JWT 인증 적용
  }
}
