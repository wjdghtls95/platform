import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { Injectable } from '@nestjs/common';
import { REDIS_KEY } from '@libs/common/utils/redis-key.util';
import { RedisGeoSearchDto } from '@libs/dao/redis/dto/redis-geo-search.dto';

@Injectable()
export class RedisUserGeoRepository extends AbstractRedisRepository {
  constructor() {
    super();
    this.createRedisClient(
      process.env.REDIS_DB_HOST,
      Number(process.env.REDIS_DB_PORT),
    );
  }

  // /**
  //  * 유저 위치 저장 (GEOADD)
  //  */
  // async setUserLocation(
  //   userId: string,
  //   lat: number,
  //   lng: number,
  // ): Promise<void> {
  //   await this.redis.geoadd(this.GEO_KEY, lng, lat, userId);
  // }
  //
  // /**
  //  * 유저 위치 조회 (GEOPOS)
  //  */
  // async getUserLocation(
  //   userId: string,
  // ): Promise<{ lat: number; lng: number } | null> {
  //   const result = await this.redis.geopos(this.GEO_KEY, userId);
  //
  //   if (!result[0]) return null;
  //
  //   return { lng: parseFloat(result[0][0]), lat: parseFloat(result[0][1]) };
  // }
  //
  // /**
  //  * 반경 내 유저 찾기 (GEORADIUS)
  //  */
  // async getNearbyUsers(
  //   lng: number,
  //   lat: number,
  //   radius: number,
  // ): Promise<unknown[]> {
  //   return this.redis.georadius(this.GEO_KEY, lng, lat, radius, 'km');
  // }

  /**
   * 유저 위치 저장 (GEOADD)
   */
  async geoAdd(
    userId: number,
    golfCourseId: number,
    placeId: string,
    lat: number,
    lng: number,
  ): Promise<void> {
    const key = REDIS_KEY.userGeo(userId, golfCourseId);

    await this.redis.geoadd(key, lat, lng, placeId);
  }

  /**
   * redis 삭제
   */
  async remove(
    userId: number,
    golfCourseId: number,
    placeId: string,
  ): Promise<void> {
    const key = REDIS_KEY.userGeo(userId, golfCourseId);

    await this.redis.zrem(key, placeId);
  }

  /**
   *  반경 내 유저 찾기 (GEORADIUS)
   */
  async geoSearch(
    userId: number,
    golfCourseId: number,
    geoSearchDto: RedisGeoSearchDto,
  ) {
    const { lat, lng, radius, unit } = geoSearchDto;

    const key = REDIS_KEY.userGeo(userId, golfCourseId);

    return this.redis.georadius(key, lng, lat, radius, unit);
  }
}
