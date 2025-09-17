import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { Injectable } from '@nestjs/common';
import { ReservationSnapshot } from '@libs/common/types/reservation.interface';
import { REDIS_KEY } from '@libs/common/utils/redis-key.util';

@Injectable()
export class RedisReservationRepository extends AbstractRedisRepository {
  constructor() {
    super();
    this.createRedisClient();
  }

  // --- Snapshot ---

  /**
   * 저장(+TTL)
   */
  async setSnapshot(
    token: string,
    data: ReservationSnapshot,
    ttlSec: number,
  ): Promise<void> {
    await this.setJson(REDIS_KEY.resvSnapshot(token), data, ttlSec); // 내부 SET EX
  }

  /**
   * 조회(유지) — 디버그/관리자용
   */
  async getSnapshot(token: string): Promise<ReservationSnapshot | null> {
    return this.getJson<ReservationSnapshot>(REDIS_KEY.resvSnapshot(token));
  }

  /**
   * 1회성 소비 — GETDEL
   */
  async popSnapshot(token: string): Promise<ReservationSnapshot | null> {
    const json = await (this.redis as any).getdel(
      REDIS_KEY.resvSnapshot(token),
    );
    return json ? (JSON.parse(json) as ReservationSnapshot) : null;
  }

  // --- Token Mapping ---

  /**
   * token -> reservationId(+TTL)
   */
  async setTokenMap(
    token: string,
    reservationId: number,
    ttlSec: number,
  ): Promise<void> {
    await this.redis.set(
      REDIS_KEY.resvTokenMap(token),
      String(reservationId),
      'EX',
      ttlSec,
    );
  }

  /**
   * 조회
   */
  async getTokenMap(token: string): Promise<number | null> {
    const str = await this.redis.get(REDIS_KEY.resvTokenMap(token));
    return str ? Number(str) : null;
  }

  /**
   * 삭제(옵션)
   */
  async delTokenMap(token: string): Promise<void> {
    await this.redis.del(REDIS_KEY.resvTokenMap(token));
  }
}
