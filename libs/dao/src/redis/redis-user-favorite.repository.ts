import { Injectable } from '@nestjs/common';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { REDIS_KEY } from '@libs/common/utils/redis-key.util';
import { RedisAddFavoriteDto } from '@libs/dao/redis/dto/redis-add-favorite.dto';

@Injectable()
export class RedisUserFavoriteRepository extends AbstractRedisRepository {
  constructor() {
    super();
    this.createRedisClient(
      process.env.REDIS_DB_HOST,
      Number(process.env.REDIS_DB_PORT),
    );
  }

  /**
   * 즐겨찾기 조회
   */
  async getFavorites(
    userId: number,
    golfCourseId: number,
  ): Promise<Record<string, RedisAddFavoriteDto>> {
    const key = REDIS_KEY.userFavorites(userId, golfCourseId);

    return (await this.getJson(key)) ?? {};
  }

  /**
   * 즐겨찾기 수정
   */
  async setFavorites(
    userId: number,
    golfCourseId: number,
    data: Record<string, RedisAddFavoriteDto>,
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
    placeId: string,
  ): Promise<void> {
    const key = REDIS_KEY.userFavorites(userId, golfCourseId);
    const cached = await this.getFavorites(userId, golfCourseId);

    delete cached[placeId];
    await this.setJson(key, cached);
  }
}
