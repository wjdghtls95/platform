import { Module } from '@nestjs/common';
import { RedisUserFavoriteRepository } from '@libs/dao/platform/redis/redis-user-favorite.repository';
import { RedisUserGeoRepository } from '@libs/dao/platform/redis/redis-user-geo.repository';
import { RedisReservationRepository } from '@libs/dao/platform/redis/redis-reservation.repository';
import {
  getRedisToken,
  RedisCoreModule,
} from '@libs/common/databases/redis/redis-core.module';
import { PLATFORM_REDIS_DB } from '../../../../../apps/platform/src/config/platform-redis.config';

export const PLATFORM_REDIS_CLIENT = getRedisToken(
  'platform',
  PLATFORM_REDIS_DB,
);

@Module({
  imports: [
    RedisCoreModule.forRoot({
      appIdentifier: 'platform',
      configKey: 'platform-redis', // registerAs 키
      dbNumber: PLATFORM_REDIS_DB, // DB 번호 전달
    }),
  ],
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
export class RedisRepositoryModule {}
