import { Redis } from 'ioredis';
import { ChainableCommander } from 'ioredis/built/utils/RedisCommander';
import { RedisFactory } from '@libs/common/databases/redis/redis.factory';

export abstract class AbstractRedisRepository {
  protected redis: Redis;
  protected readonly dbNumber: number;

  createRedisClient(host: string, port: number): void {
    this.redis = RedisFactory.createRedisClient(host, port, this.dbNumber);
  }

  async pipeline(): Promise<ChainableCommander> {
    return this.redis.pipeline();
  }

  async flushDb(): Promise<'OK'> {
    return this.redis.flushdb();
  }

  async close(): Promise<'OK'> {
    return this.redis.quit();
  }

  async delKeys(keys: string[]): Promise<number> {
    return this.redis.del(keys);
  }

  async renameKey(key: string, newKey: string): Promise<void> {
    await this.redis.rename(key, newKey);
  }

  async allKeys(): Promise<string[]> {
    return this.redis.keys('*');
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async setJson<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }
}
