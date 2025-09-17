import { TestingModule } from '@nestjs/testing';
import { RedisUserFavoriteRepository } from '@libs/dao/platform/redis/redis-user-favorite.repository';
import { RedisUserGeoRepository } from '@libs/dao/platform/redis/redis-user-geo.repository';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { RedisFactory } from '@libs/common/databases/redis/redis.factory';

export class TestRedisDataSourceUtils {
  /**
   * 모든 레디스 정보 클리어
   */
  static async clearRedisDataSource(module: TestingModule): Promise<void> {
    await TestRedisDataSourceUtils.redisFlushDb(module);

    const allClient = RedisFactory.getAllRedisClient();

    await Promise.all(
      allClient.map(async (client) => {
        if (client.status === 'ready') {
          await client.unsubscribe();
        }
        return client.quit();
      }),
    );
  }

  /**
   * 레디스 데이터 초기화
   */
  static async redisFlushDb(module: TestingModule): Promise<void> {
    const redisDataSourceMap =
      TestRedisDataSourceUtils.getRedisRepositories(module);

    await Promise.all(redisDataSourceMap.map((it) => it.flushDb()));
  }

  /**
   * 모든 레디스 레포지토리 조회
   */
  static getRedisRepositories(
    module: TestingModule,
  ): AbstractRedisRepository[] {
    const redisDataSourceMap = [];

    // favorite
    try {
      const redisUserFavoriteRepository =
        module.get<RedisUserFavoriteRepository>(RedisUserFavoriteRepository);
      redisDataSourceMap.push(redisUserFavoriteRepository);
    } catch (_) {
      /* empty */
    }

    // geo location
    try {
      const redisUserGeoRepository = module.get<RedisUserGeoRepository>(
        RedisUserGeoRepository,
      );
      redisDataSourceMap.push(redisUserGeoRepository);
    } catch (_) {
      /* empty */
    }

    return redisDataSourceMap;
  }

  /**
   * redis 소켓 상태 체크 및 종료
   */
  static async checkRedisSocketStatusAnd(): Promise<void> {
    await RedisFactory.logRedisClientStatus();
  }
}
