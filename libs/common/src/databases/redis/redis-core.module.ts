import { DynamicModule, Module, Provider, Global } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisFactory } from './redis.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Redis DB 번호에 따른 동적 DI 토큰 생성
 */
export const getRedisToken = (
  appIdentifier: string,
  dbNumber: number,
): string => {
  return `REDIS_CLIENT_${appIdentifier}_${dbNumber}`;
};

/**
 * Redis 모듈 설정 옵션
 */
export interface RedisModuleOptions {
  appIdentifier: string;
  configKey: string;
  dbNumber: number;
}

/**
 * ❗️ [추가됨] forRootAsync에서 사용할 비동기 옵션 인터페이스
 */
export interface RedisCoreModuleAsyncOptions {
  imports?: any[];
  // useFactory는 ConfigService 등을 주입받아 RedisModuleOptions를 반환
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
  inject?: any[];
  /** ❗️ 이 모듈이 제공할 "DI 토큰"을 명시적으로 받음 */
  token: string;
}

@Global() // ❗️ 전역 모듈로 변경
@Module({})
export class RedisCoreModule {
  /**
   * 동기 방식 등록
   */
  static forRoot(options: RedisModuleOptions): DynamicModule {
    const providers = [
      {
        provide: getRedisToken(options.appIdentifier, options.dbNumber),
        useFactory: (configService: ConfigService): Redis => {
          // ❗️ 동기 방식도 ConfigService를 사용하도록 수정
          return RedisFactory.createRedisClient(
            configService,
            options.configKey,
            options.dbNumber,
            options.appIdentifier,
          );
        },
        inject: [ConfigService],
      },
    ];

    return {
      module: RedisCoreModule,
      imports: [ConfigModule], // ❗️ ConfigModule 임포트
      providers: providers,
      exports: providers.map((p) => (p as any).provide),
    };
  }

  /**
   * ❗️ [추가됨] 비동기 방식 등록 (순환 참조 해결용)
   */
  static forRootAsync(options: RedisCoreModuleAsyncOptions): DynamicModule {
    const asyncProvider: Provider = {
      // ❗️ 호출부(RedisRepositoryModule)에서 지정한 "DI 토큰"을 사용
      provide: options.token,
      useFactory: async (
        ...args: any[] // ❗️ inject된 서비스들 (예: ConfigService)
      ): Promise<Redis> => {
        // 1. .env 로드가 완료된 ConfigService를 사용하여 옵션을 가져옴
        const moduleOptions = await options.useFactory(...args);
        const { appIdentifier, configKey, dbNumber } = moduleOptions;

        // 2. ConfigService를 RedisFactory로 전달
        const configService = args.find((arg) => arg instanceof ConfigService);
        if (!configService) {
          // ❗️ ConfigService가 inject 배열에 없으면 에러 발생
          throw new Error(
            'ConfigService must be injected in forRootAsync options.inject',
          );
        }

        return RedisFactory.createRedisClient(
          configService,
          configKey,
          dbNumber,
          appIdentifier,
        );
      },
      // ❗️ ConfigService가 기본으로 포함되도록 하거나, options.inject를 사용
      inject: options.inject || [ConfigService],
    };

    return {
      module: RedisCoreModule,
      imports: options.imports || [ConfigModule], // ❗️ ConfigModule 임포트
      providers: [asyncProvider],
      exports: [asyncProvider.provide],
    };
  }

  async onApplicationShutdown(): Promise<void> {
    await RedisFactory.logRedisClientStatus();
  }
}
