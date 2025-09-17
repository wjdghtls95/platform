import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { Injectable } from '@nestjs/common';
import { REDIS_KEY } from '@libs/common/utils/redis-key.util';
import { RedisGeoSearchDto } from '@libs/dao/platform/redis/dto/redis-geo-search.dto';

@Injectable()
export class RedisUserGeoRepository extends AbstractRedisRepository {
  constructor() {
    super();
    this.createRedisClient();
  }

  /**
   * 유저 위치 저장 (GEOADD)
   */
  async geoAdd(
    userId: number,
    golfCourseId: number,
    placeId: number,
    lat: string,
    lng: string,
  ): Promise<void> {
    const key = REDIS_KEY.userGeo(userId, golfCourseId);

    await this.redis.geoadd(key, lng, lat, placeId);
  }

  /**
   * redis 삭제
   */
  async remove(
    userId: number,
    golfCourseId: number,
    placeId: number,
  ): Promise<void> {
    const key = REDIS_KEY.userGeo(userId, golfCourseId);

    await this.redis.zrem(key, placeId);
  }

  /**
   *  반경 내 유저 찾기 (GEORADIUS)
   */
  async geoSearch(userId: number, redisGeoSearchDto: RedisGeoSearchDto) {
    const { golfCourseId, lat, lng, radius, unit } = redisGeoSearchDto;

    const key = REDIS_KEY.userGeo(userId, golfCourseId);

    return this.redis.georadius(key, lng, lat, radius, unit);
  }
}
