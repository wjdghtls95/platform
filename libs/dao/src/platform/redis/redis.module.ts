import { Module } from '@nestjs/common';
import { RedisUserFavoriteRepository } from '@libs/dao/platform/redis/redis-user-favorite.repository';
import { RedisUserGeoRepository } from '@libs/dao/platform/redis/redis-user-geo.repository';
import { RedisReservationRepository } from '@libs/dao/platform/redis/redis-reservation.repository';

@Module({
  providers: [
    RedisUserFavoriteRepository,
    RedisUserGeoRepository,
    RedisReservationRepository,
  ],
  exports: [
    RedisUserFavoriteRepository,
    RedisUserGeoRepository,
    RedisReservationRepository,
  ],
})
export class RedisModule {}
