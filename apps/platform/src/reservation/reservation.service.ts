import { Inject, Injectable } from '@nestjs/common';
import { ReservationRepository } from '@libs/dao/platform/reservation/reservation.repository';
import { CreateRedirectTokenInDto } from '@libs/dao/platform/reservation/dto/create-redirect-token-in.dto';
import { CreateRedirectTokenOutDto } from '@libs/dao/platform/reservation/dto/create-redirect-token-out.dto';
import { TimeUtil } from '@libs/common/utils/time.util';
import { TokenUtil } from '@libs/common/utils/token.util';
import { RedisReservationRepository } from '@libs/dao/platform/redis/redis-reservation.repository';
import { ReservationSnapshot } from '@libs/common/types/reservation.interface';
import {
  REDIRECT_TOKEN_TTL_SEC,
  TOKEN_MAP_TTL_SEC,
} from '@libs/common/constants/token.constants';
import {
  RESERVATION_STATUS,
  ReservationStatus,
} from '@libs/common/constants/reservation-status.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Reservation } from '@libs/dao/platform/reservation/reservation.entity';
import { ConfirmReservationOutDto } from '@libs/dao/platform/reservation/dto/confirm-reservation-out.dto';

@Injectable()
export class ReservationService {
  constructor(
    @Inject(ReservationRepository)
    private readonly reservationRepository: ReservationRepository,

    private readonly redisReservationRepository: RedisReservationRepository,
  ) {}

  /**
   * 예약 리다이렉트 토큰 생성
   */
  async createRedirectToken(
    createRedirectTokenInDto: CreateRedirectTokenInDto,
  ): Promise<CreateRedirectTokenOutDto> {
    const { userId, golfCourseId, startAt, endAt, partySize, provider } =
      createRedirectTokenInDto;

    const now = TimeUtil.now();

    if (startAt <= now) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.RESERVATION_INVALID_START_AT,
      );
    }

    // endAt 없을때 partySize 에 따라 1시간씩 추가
    if (endAt == null) {
      createRedirectTokenInDto.endAt = TimeUtil.addHours(
        new Date(startAt),
        partySize,
      );
    }

    // 예약 토큰 - 불투명 토큰 생성
    const reservationToken = TokenUtil.generateOpaqueToken('gp');

    // redirect URL - 예약 사이트 주소
    const redirectUrl = this._createRedirectUrl(
      process.env.MOCK_PROVIDER_URL,
      createRedirectTokenInDto,
    );

    // redis 스냅샷 저장 (유저 예약 확인 전 캐싱)
    const snapshot: ReservationSnapshot = {
      userId: userId,
      golfCourseId: golfCourseId,
      startAt: startAt.toString(),
      endAt: endAt.toString(),
      partySize: partySize,
      provider: provider,
    };

    await this.redisReservationRepository.setSnapshot(
      reservationToken,
      snapshot,
      REDIRECT_TOKEN_TTL_SEC,
    );

    // token 만료 기간
    const expiresAt = TimeUtil.addMinutes(
      TimeUtil.now(),
      REDIRECT_TOKEN_TTL_SEC,
    );

    return CreateRedirectTokenOutDto.of({
      reservationToken,
      redirectUrl,
      expiresAt,
    });
  }

  /**
   * 유저가 예약 확정을 눌렀을때
   * TODO.. 동시성 제어도 있어야함 (다른 유저가 비슷한 시간대에 예약을 눌렀을때 대비해서)
   */
  async confirmByToken(token: string): Promise<ConfirmReservationOutDto> {
    const snapshot = await this.redisReservationRepository.popSnapshot(token);

    if (!snapshot) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.REDIS_INVALID_OR_EXPIRED_TOKEN,
      );
    }

    const reservation = Reservation.create({
      userId: snapshot.userId,
      golfCourseId: snapshot.golfCourseId,
      startAt: new Date(snapshot.startAt),
      endAt: new Date(snapshot.endAt),
      partySize: snapshot.partySize,

      status: RESERVATION_STATUS.confirmed,
    });

    await this.reservationRepository.insert(reservation);

    await this.redisReservationRepository.setTokenMap(
      token,
      reservation.id,
      TOKEN_MAP_TTL_SEC,
    );

    return ConfirmReservationOutDto.of({
      reservationId: reservation.id,
      status: reservation.status as ReservationStatus,
    });
  }

  /**
   * 리다이렉트 url 생성
   */
  private _createRedirectUrl(baseUrl: string, params: unknown): string {
    const url = new URL(baseUrl);

    for (const [key, value] of Object.entries(
      params as Record<string, unknown>,
    )) {
      if (value == null) continue; // params 에 null || undefined 스킵

      url.searchParams.set(key, String(value));
    }

    return url.toString();
  }
}
