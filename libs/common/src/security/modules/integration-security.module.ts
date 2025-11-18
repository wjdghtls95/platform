import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { AuthTokenStrategy } from '../strategy/auth-token.strategy';
import { SecurityService } from '../security.service';

/**
 * Integration 서비스 전용 보안 모듈
 * - JWT 인증 (Platform이 발급한 토큰 검증)
 * - AuthToken 인증 (이메일 인증 링크 등)
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [JwtStrategy, AuthTokenStrategy, SecurityService],
  exports: [JwtStrategy, AuthTokenStrategy, SecurityService, PassportModule],
})
export class IntegrationSecurityModule {}
