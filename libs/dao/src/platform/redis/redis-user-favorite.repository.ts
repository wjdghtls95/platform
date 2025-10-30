import { Inject, Injectable } from '@nestjs/common';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { REDIS_KEY } from '@libs/common/utils/redis-key.util';
import { RedisAddFavoriteDto } from '@libs/dao/platform/redis/dto/redis-add-favorite.dto';
import { Redis } from 'ioredis';
import { PLATFORM_REDIS_CLIENT } from '@libs/dao/platform/redis/constants/redis.constants';

@Injectable()
export class RedisUserFavoriteRepository extends AbstractRedisRepository {
  constructor(@Inject(PLATFORM_REDIS_CLIENT) protected readonly redis: Redis) {
    super();
  }

  /**
   * 즐겨찾기 조회
   */
  async getFavorites(
    userId: number,
    golfCourseId: number,
  ): Promise<Record<number, RedisAddFavoriteDto>> {
    const key = REDIS_KEY.userFavorites(userId, golfCourseId);

    return (await this.getJson(key)) ?? {};
  }

  /**
   * 즐겨찾기 수정
   */
  async setFavorites(
    userId: number,
    golfCourseId: number,
    data: Record<number, RedisAddFavoriteDto>,
  ): Promise<void> {
    const key = REDIS_KEY.userFavorites(userId, golfCourseId);

    await this.setJson(key, data);
  }

  /**
   * 즐겨찾기 삭제
   */
  async removeFavorite(
    userId: number,
    golfCourseId: number,
    placeId: number,
  ): Promise<void> {
    const key = REDIS_KEY.userFavorites(userId, golfCourseId);
    const cached = await this.getFavorites(userId, golfCourseId);

    delete cached[placeId];
    await this.setJson(key, cached);
  }
}
