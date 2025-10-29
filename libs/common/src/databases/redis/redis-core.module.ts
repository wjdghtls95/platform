import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisFactory } from './redis.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Redis DB 번호에 따른 동적 DI 토큰 생성
 * @param appIdentifier - app 식별자 (예: 'platform', 'llm-gateway')
 * @param dbNumber - Redis DB 번호 (
 * @returns DI 토큰 문자열
 * @example getRedisToken('platform', 0) // 'REDIS_CLIENT_platform_0'
 */
export const getRedisToken = (
  appIdentifier: string,
  dbNumber: number,
): string => {
  return `REDIS_CLIENT_${appIdentifier}_${dbNumber}`;
};

/**
 * RedisModuleOptions 인터페이스
 */
export interface RedisModuleOptions {
  appIdentifier: string; // platform, llm-gateway
  configKey: string; // platform-redis, llm-gateway-redis
  dbNumber: number;
}

/**
 * Redis Core Module (Dynamic Module)
 */
@Module({})
export class RedisCoreModule {
  /**
   * 전역 등록: 애플리케이션 전체에서 사용할 Redis 설정
   */
  static forRoot(options: RedisModuleOptions): DynamicModule {
    const providers = this.createRedisProviders(options);

    return {
      module: RedisCoreModule,
      imports: [ConfigModule],
      global: true,
      providers,
      exports: providers.map((p) => (p as any).provide),
    };
  }

  /**
   * 지역 등록: 특정 모듈에서만 사용할 Redis 설정
   */
  static register(options: RedisModuleOptions): DynamicModule {
    const providers = this.createRedisProviders(options);

    return {
      module: RedisCoreModule,
      imports: [ConfigModule],
      providers,
      exports: providers.map((p) => (p as any).provide),
    };
  }

  /**
   * Redis Provider 동적 생성
   * 환경변수에서 DB 번호를 읽어 자동으로 Provider 생성
   */
  private static createRedisProviders(options: RedisModuleOptions): Provider[] {
    const { appIdentifier, configKey, dbNumber } = options;

    return [
      {
        provide: getRedisToken(appIdentifier, dbNumber),

        useFactory: (configService: ConfigService): Redis => {
          return RedisFactory.createRedisClient(
            configService, // 1. ConfigService 전달
            configKey, // 2. 'llm-gateway-redis' 같은 키 전달
            dbNumber, // 3. DB 번호 전달
            appIdentifier, // 4. 'llm-gateway' 같은 식별자 전달
          );
        },
        inject: [ConfigService], // 의존성 주입
      },
    ];
  }

  /**
   * 애플리케이션 종료 시 Redis 연결 정리
   */
  async onApplicationShutdown(): Promise<void> {
    await RedisFactory.logRedisClientStatus();
  }
}
