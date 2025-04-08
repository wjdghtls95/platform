import { Module } from '@nestjs/common';
import { RedisUserFavoriteRepository } from '@libs/dao/redis/redis-user-favorite.repository';
import { RedisUserGeoRepository } from '@libs/dao/redis/redis-user-geo.repository';

@Module({
  providers: [RedisUserFavoriteRepository, RedisUserGeoRepository],
  exports: [RedisUserFavoriteRepository, RedisUserGeoRepository],
})
export class RedisModule {}
