import { Logger } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

const customRedisClient: Record<string, Redis> = {};
const logger = new Logger('RedisFactory');

export class RedisFactory {
  static getAllRedisClient(): Redis[] {
    return Object.values(customRedisClient);
  }

  static createRedisClient(
    configService: ConfigService,
    configKey: string,
    dbNumber = 0 as number,
    appIdentifier: string,
  ): Redis {
    const cacheKey = `${appIdentifier}:${dbNumber}`;

    if (customRedisClient[cacheKey]) {
      return customRedisClient[cacheKey];
    }

    const configMap =
      configService.get<Record<number, RedisOptions>>(configKey);

    if (!configMap) {
      const error = `Redis config key not found in ConfigService: ${configKey}`;
      logger.error(error);
      throw new Error(error);
    }

    const config = configMap[dbNumber];

    if (!config) {
      const error = `Redis config not found: ${appIdentifier} DB${dbNumber} (Key: ${configKey})`;
      logger.error(error);
      throw new Error(error);
    }

    customRedisClient[cacheKey] = new Redis({
      ...config,
      role: 'master',
    });

    logger.log(`Redis client created: ${cacheKey}`);
    return customRedisClient[cacheKey];
  }

  /**
   * redis 소켓 상태에 따른 종료
   */
  static async logRedisClientStatus(): Promise<void> {
    const clients = RedisFactory.getAllRedisClient();
    for (const [i, client] of clients.entries()) {
      logger.debug(`[Redis #${i}] status: ${client.status}`);
      if (client.status === 'ready' || client.status === 'connecting') {
        try {
          await client.unsubscribe?.();
          await client.punsubscribe?.();
          await client.quit().catch(() => client.disconnect?.());
          logger.debug(`[Redis #${i}] 종료 처리 완료`);
        } catch (e) {
          logger.debug(`[Redis #${i}] 종료 실패:`, e);
        }
      }
    }

    // test 환경에서만
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const handles = process._getActiveHandles();
      logger.debug('🧪 active handles:', handles.length);

      handles.forEach((handle, i) => {
        logger.debug(`🔍 handle[${i}]:`, handle.constructor?.name);
      });
    }
  }
}
