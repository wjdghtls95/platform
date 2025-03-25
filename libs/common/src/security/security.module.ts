import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ACCESS_TOKEN_SECRET_KEY } from '../constants/token.constants';
import { JwtStrategy } from '@libs/common/security/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from '../../../../apps/platform/src/auth/google/strategy/google.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: ['jwt', 'google'] }), // 기본 전략을 jwt로 설정

    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET_KEY,
    }),
  ],
  providers: [JwtStrategy, GoogleStrategy], // Security 관련 프로바이더 등록
  exports: [JwtStrategy, GoogleStrategy],
})
export class SecurityModule {}
