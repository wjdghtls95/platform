import { Redis } from 'ioredis';
import platformRedisConfig from '../../../../../apps/platform/src/config/platform-redis.config';

const customRedisClient: Record<string, Redis> = {};

export class RedisFactory {
  static getAllRedisClient(): Redis[] {
    return Object.values(customRedisClient);
  }

  static createRedisClient(dbNumber = 0): Redis {
    return (customRedisClient[dbNumber] ??= new Redis({
      ...platformRedisConfig()[dbNumber],
      role: 'master',
    }));
  }

  /**
   * redis 소켓 상태에 따른 종료
   */
  static async logRedisClientStatus(): Promise<void> {
    const clients = RedisFactory.getAllRedisClient();
    for (const [i, client] of clients.entries()) {
      console.log(`[Redis #${i}] status: ${client.status}`);
      if (client.status === 'ready' || client.status === 'connecting') {
        try {
          await client.unsubscribe?.();
          await client.punsubscribe?.();
          await client.quit().catch(() => client.disconnect?.());
          console.log(`[Redis #${i}] 🔌 종료 처리 완료`);
        } catch (e) {
          console.log(`[Redis #${i}] 종료 실패:`, e);
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const handles = process._getActiveHandles();
    console.log('🧪 active handles:', handles.length);

    handles.forEach((handle, i) => {
      console.log(`🔍 handle[${i}]:`, handle.constructor?.name);
    });
  }
}
