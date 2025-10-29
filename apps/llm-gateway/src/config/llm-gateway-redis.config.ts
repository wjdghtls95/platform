import { registerAs } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

// llm-gateway가 사용할 DB 번호를 상수로 export (기본값 1)
export const LLM_GATEWAY_REDIS_DB =
  Number(process.env.LLM_GATEWAY_REDIS_DB) || 1;

/**
 * 순수 설정 함수
 */
export const llmGatewayRedisConfigFn = (): Record<number, RedisOptions> => {
  const appName = process.env.APP_NAME || 'llm-gateway';

  return {
    [LLM_GATEWAY_REDIS_DB]: {
      // 상수를 키로 사용
      host: process.env.REDIS_DB_HOST || 'localhost',
      port: Number(process.env.REDIS_DB_PORT) || 6379,
      db: LLM_GATEWAY_REDIS_DB, // DB 번호 명시
      keyPrefix: `${appName}:`,
    },
  };
};

/**
 * ConfigModule load 용
 */
export default registerAs('llm-gateway-redis', llmGatewayRedisConfigFn);
