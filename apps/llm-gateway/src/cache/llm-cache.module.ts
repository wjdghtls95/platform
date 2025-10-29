import { Module } from '@nestjs/common';
import { LLM_GATEWAY_REDIS_DB } from '../config/llm-gateway-redis.config';
import { LLMCacheService } from './llm-cache.service';
import { RedisCoreModule } from '@libs/common/databases/redis/redis-core.module';

@Module({
  imports: [
    /**
     * 공용 RedisCoreModule을 llm-gateway 설정으로 초기화
     * configKey: 'llm-gateway'
     * configProvider: 위에서 export한 설정 함수
     */
    RedisCoreModule.forRoot({
      appIdentifier: 'llm-gateway',
      configKey: 'llm-gateway-redis', // registerAs 키
      dbNumber: LLM_GATEWAY_REDIS_DB, // 명시적으로 DB 번호(1) 전달
    }),
  ],
  providers: [LLMCacheService],
  exports: [LLMCacheService],
})
export class LLMCacheModule {}
