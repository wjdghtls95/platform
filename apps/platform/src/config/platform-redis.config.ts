import { registerAs } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

// platform이 사용할 DB 번호를 상수로 export (기본값 0)
export const PLATFORM_REDIS_DB =
  Number(process.env.PLATFORM_REDIS_DB_NUMBER) || 0;

/**
 * 순수 설정 함수 (Factory 테스트 코드용)
 */
export const platformRedisConfigFn = (): Record<number, RedisOptions> => {
  const appName = process.env.APP_NAME || 'platform';

  return {
    [PLATFORM_REDIS_DB]: {
      // 상수를 키로 사용
      host: process.env.REDIS_DB_HOST || 'localhost',
      port: Number(process.env.REDIS_DB_PORT) || 6379,
      db: PLATFORM_REDIS_DB, // DB 번호 명시
      keyPrefix: `${appName}:`,
    },
  };
};

/**
 * ConfigModule load 용
 */
export default registerAs('platform-redis', platformRedisConfigFn);
