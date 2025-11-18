import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { InternalApiKeyStrategy } from '../strategy/internal-api-key.strategy';
import { SecurityService } from '../security.service';

/**
 * LLM Gateway 서비스 전용 보안 모듈
 * - JWT 인증 (Platform이 발급한 토큰 검증)
 * - Internal API Key 인증 (서비스 간 통신)
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // LLM Gateway는 토큰 발급 안 하므로 signOptions 생략
      }),
    }),
  ],
  providers: [
    JwtStrategy, // JWT 검증 (Platform이 발급한 토큰)
    InternalApiKeyStrategy, // API Key 검증
    SecurityService, // 공통 유틸리티
  ],
  exports: [
    JwtStrategy,
    InternalApiKeyStrategy,
    SecurityService,
    PassportModule,
  ],
})
export class LLmGatewaySecurityModule {}
