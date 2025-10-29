import { Injectable, Inject, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ChatOutDto } from '../chat/dto/chat-out.dto';
import { ChatInDto } from '../chat/dto/chat-in.dto';
import { Redis } from 'ioredis';
import { getRedisToken } from '@libs/common/databases/redis/redis-core.module';
import { LLM_GATEWAY_REDIS_DB } from '../config/llm-gateway-redis.config';

export const LLM_GATEWAY_REDIS_CLIENT = getRedisToken(
  'llm-gateway',
  LLM_GATEWAY_REDIS_DB,
);

/**
 * LLM 응답을 Redis에 캐싱하는 서비스
 * 동일한 요청에 대해 API 비용을 절감하고 응답 속도를 향상
 */
@Injectable()
export class LLMCacheService {
  private readonly logger = new Logger(LLMCacheService.name);

  constructor(
    @Inject(LLM_GATEWAY_REDIS_CLIENT) protected readonly redis: Redis,
  ) {}

  /**
   * DTO 객체를 기반으로 고유한 캐시 키를 생성
   * 동일한 분석 데이터, 언어, 모델 요청은 동일한 키를 갖음
   * @param dto ChatOutDto
   * @returns SHA256 해시 키 (예: 'llm:abc123...')
   */
  generateKey(chatOutDto: ChatOutDto): string {
    // 캐시 키에 영향을 줄 핵심 요소들을 직렬화
    const dataToHash = JSON.stringify({
      analysisData: chatOutDto.analysisData,
      language: chatOutDto.language,
      model: chatOutDto.model,
      provider: chatOutDto.provider,
    });

    // SHA256 해시를 사용하여 고정 길이의 키 생성
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    return `llm:${hash}`;
  }

  /**
   * 캐시에서 데이터를 조회
   */
  async get(key: string): Promise<ChatInDto | null> {
    try {
      const value = await this.redis.get(key);

      return value ? (JSON.parse(value) as ChatInDto) : null;
    } catch (error) {
      this.logger.error(`Redis GET 실패: ${error.message}`, key);
      return null; // 캐시 장애 시, LLM을 호출하도록 null 반환
    }
  }

  /**
   * 캐시에 데이터를 저장
   * @param ttl Time-to-Live (초 단위)
   */
  async set(key: string, value: ChatInDto, ttl = 3600): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      this.logger.error(`Redis SET 실패: ${error.message}`, key);
    }
  }

  /**
   * 특정 캐시를 삭제
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Redis DEL 실패: ${error.message}`, key);
    }
  }
}
