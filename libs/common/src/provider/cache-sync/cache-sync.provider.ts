import { Inject, Injectable } from '@nestjs/common';
import { RedisUserFavoriteRepository } from '@libs/dao/redis/redis-user-favorite.repository';
import { RedisUserGeoRepository } from '@libs/dao/redis/redis-user-geo.repository';
import { FavoriteRepository } from '@libs/dao/favorite/favorite.repository';

@Injectable()
export class CacheSyncProvider {
  constructor(
    @Inject(FavoriteRepository)
    private readonly favoriteRepository: FavoriteRepository,

    // redis
    private readonly redisUserFavoriteRepository: RedisUserFavoriteRepository,
    private readonly redisUserGeoRepository: RedisUserGeoRepository,
  ) {}

  /**
   * 로그인시 Redis 캐시 동기화
   */

  /**
   * 조건부 Redis 캐시 동기화 (Hash + GEO 정합성 확인)
   */
  async syncCacheByCondition(userId: number): Promise<void> {
    const favorites = await this.favoriteRepository.findManyByUserId(userId);
    if (favorites.length === 0) return;

    const favorite = favorites[0];
    const hash = await this.redisUserFavoriteRepository.getFavorites(
      userId,
      favorite.golfCourseId,
    );

    const geoPlaceIds = await this.redisUserGeoRepository.geoSearch(userId, {
      golfCourseId: favorite.golfCourseId,
      lat: favorite.lat,
      lng: favorite.lng,
      radius: 1,
      unit: 'km',
    });

    if (
      hash &&
      Object.keys(hash).length > 0 &&
      geoPlaceIds &&
      geoPlaceIds.length > 0
    ) {
      return; // Hash, GEO 둘 다 존재 → 동기화 생략
    }

    await this.syncCache(userId); // 하나라도 없으면 동기화
  }

  /**
   * 강제 Redis 캐시 동기화 (DB 기준)
   */
  async syncCache(userId: number): Promise<void> {
    const favorites = await this.favoriteRepository.findManyByUserId(userId);

    const courseGroups = new Map<number, Record<string, any>>();
    const geoAddPromises = [];

    for (const favorite of favorites) {
      if (!courseGroups.has(favorite.golfCourseId)) {
        courseGroups.set(favorite.golfCourseId, {});
      }

      courseGroups.get(favorite.golfCourseId)![favorite.placeId] = {
        golfCourseId: favorite.golfCourseId,
        placeId: favorite.placeId,
        name: favorite.name,
        category: favorite.category,
        lat: favorite.lat,
        lng: favorite.lng,
      };

      geoAddPromises.push(
        this.redisUserGeoRepository.geoAdd(
          favorite.userId,
          favorite.golfCourseId,
          favorite.placeId,
          favorite.lat,
          favorite.lng,
        ),
      );
    }

    await Promise.all(geoAddPromises);

    const setFavoritePromises = Array.from(courseGroups.entries()).map(
      ([golfCourseId, data]) =>
        this.redisUserFavoriteRepository.setFavorites(
          userId,
          golfCourseId,
          data,
        ),
    );

    await Promise.all(setFavoritePromises);
  }
}
