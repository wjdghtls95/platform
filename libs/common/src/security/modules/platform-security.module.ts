import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { AuthTokenStrategy } from '../strategy/auth-token.strategy';
import { SecurityService } from '../security.service';
import { GoogleStrategy } from '../../../../../apps/platform/src/auth/google/strategy/google.strategy';
import { ACCESS_TOKEN_SECRET_KEY } from '@libs/common/constants/token.constants';

/**
 * Platform 서비스 전용 보안 모듈
 * - JWT 인증 (사용자 로그인)
 * - AuthToken 인증 (특정 API)
 * - Google 로그인은 Platform의 AuthModule에서 처리
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: ['jwt', 'google'] }),
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET_KEY,
    }),

    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'),
    //     signOptions: {
    //       expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
    //     },
    //   }),
    // }),
  ],
  providers: [
    JwtStrategy, // JWT 검증
    GoogleStrategy,
    AuthTokenStrategy, // Auth Token 검증
    SecurityService, // 공통 유틸리티
  ],
  exports: [
    JwtStrategy,
    GoogleStrategy,
    AuthTokenStrategy,
    SecurityService,
    PassportModule,
    JwtModule, // AuthService에서 JwtService 사용 가능하도록
  ],
})
export class PlatformSecurityModule {}
