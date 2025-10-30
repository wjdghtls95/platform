import { getRedisToken } from '@libs/common/databases/redis/redis-core.module';

/**
 * platform 앱의 Redis DB 번호 기본값 (순환 참조 방지)
 * .env에서 값을 읽는 로직은 Async 모듈의 useFactory로 이동
 */
export const PLATFORM_REDIS_DB_DEFAULT = 0;

/**
 * 이 상수는 "platform DAO 라이브러리" 내부에서만 사용될
 * "DI 토큰"이며, DB 번호 0을 사용합니다.
 * (libs/dao/src/platform/redis/ 폴더 내부 파일들만 이 상수를 import합니다)
 */
export const PLATFORM_REDIS_CLIENT = getRedisToken(
  'platform',
  PLATFORM_REDIS_DB_DEFAULT,
);
