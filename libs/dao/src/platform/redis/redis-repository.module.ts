import { Module } from '@nestjs/common';
import { RedisUserFavoriteRepository } from './redis-user-favorite.repository';
import { RedisUserGeoRepository } from './redis-user-geo.repository';
import { RedisReservationRepository } from './redis-reservation.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCoreModule } from '@libs/common/databases/redis/redis-core.module';
import {
  PLATFORM_REDIS_CLIENT,
  PLATFORM_REDIS_DB_DEFAULT,
} from '@libs/dao/platform/redis/constants/redis.constants';

@Module({
  imports: [
    // ❗️ [수정] forRootAsync를 사용하여 순환 참조 해결
    RedisCoreModule.forRootAsync({
      imports: [ConfigModule], // ❗️ ConfigModule 의존성 명시
      // ❗️ "DI 토큰"을 명시적으로 전달
      token: PLATFORM_REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        // ❗️ ConfigService가 준비된 후에 .env 값을 안전하게 읽음
        const dbNumber =
          configService.get<number>('PLATFORM_REDIS_DB') ||
          PLATFORM_REDIS_DB_DEFAULT;

        return {
          appIdentifier: 'platform',
          configKey: 'platform-redis', // platform-redis.config.ts의 registerAs 키
          dbNumber: dbNumber,
        };
      },
      inject: [ConfigService], // ❗️ ConfigService 주입
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
