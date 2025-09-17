import { ReservationRepository } from '@libs/dao/platform/reservation/reservation.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { GolfCourseRepository } from '@libs/dao/platform/golf-course/golf-course.repository';
import { CalendarProvider } from '@libs/common/provider/calendar/calendar.provider';
import {
  CalendarLinkOutDto,
  IcsTextOutDto,
} from '@libs/dao/platform/calendar/dto/calendar.dto';
import { RESERVATION_STATUS } from '@libs/common/constants/reservation-status.constants';
import { Reservation } from '@libs/dao/platform/reservation/reservation.entity';

@Injectable()
export class CalendarService {
  constructor(
    @Inject(ReservationRepository)
    private readonly reservationRepository: ReservationRepository,
    @Inject(GolfCourseRepository)
    private readonly golfCourseRepository: GolfCourseRepository,

    private readonly calendarProvider: CalendarProvider,
  ) {}

  /**
   * 예약 아이디로 Ics 생성
   */
  async createIcsByReservationId(
    reservationId: number,
  ): Promise<IcsTextOutDto> {
    const reservation = await this._checkReservation(reservationId);

    // const course = await this.golfCourseRepository.

    const uid = `resv-${reservation.id}@golf-platform`;

    const end =
      reservation.endAt ??
      new Date(reservation.startAt.getTime() + 60 * 60 * 1000);

    const payload = {
      uid: uid,
      start: reservation.startAt,
      end: end,
      summary: `Reservation #${reservation.id}`,
      description: `Golf course: ${reservation.golfCourseId} / Party: ${reservation.partySize}`, // courseId로 위치 get 해오면 될듯
    };

    const ics = this.calendarProvider.buildIcsText(payload);

    return IcsTextOutDto.of({ icsText: ics });
  }

  /**
   * 예약 아이디로 각 캘린더 링크 묶음 생성
   */
  async createCalendarLinks(
    reservationId: number,
  ): Promise<CalendarLinkOutDto> {
    const reservation = await this._checkReservation(reservationId);

    // link 생성할 value 들
    const start = reservation.startAt;
    const end =
      reservation.endAt ??
      new Date(reservation.startAt.getTime() + 60 * 60 * 1000); // TODO,, endAt 부분 endAt 이 없으면 start 에 partySize * 1시간 갑 더하면 됨
    const title = `Golf reservation #${reservation.id}`;
    const details = `Course ${reservation.golfCourseId}, party ${reservation.partySize}`;

    // url
    const googleCalendarTemplateUrl =
      this.calendarProvider.createGoogleTemplateUrl(start, end, title, details);

    const icsUrl = this.calendarProvider.createIcsUrl(reservationId);
    const webCalUrl = this.calendarProvider.createWebCalUrl(reservationId);

    return CalendarLinkOutDto.of({
      googleTemplateUrl: googleCalendarTemplateUrl,
      icsUrl: icsUrl,
      webCalUrl: webCalUrl,
    });
  }

  /**
   * 서버가 pref + User-Agent를 보고 가장 적절한 링크(구글 템플릿 / ICS / WebCal)로 리다이렉트 시켜주는 게이트웨이
   */
  async selectCalendarLink(
    reservationId: number,
    pref: 'auto' | 'google' | 'ics' | 'webcal',
    userAgent?: string,
  ): Promise<string> {
    const links = await this.createCalendarLinks(reservationId);

    // 명시 선택이 있으면 그대로
    if (pref === 'google') return links.googleTemplateUrl;
    if (pref === 'ics') return links.icsUrl;
    if (pref === 'webcal') return links.webCalUrl;

    // 자동 분기
    const { isIOS, isAndroid } = this._detectPlatform(userAgent);

    if (isIOS) return links.webCalUrl; // iOS는 webcal이 자연스러움
    if (isAndroid) return links.icsUrl; // Android는 ICS 다운로드가 무난

    return links.googleTemplateUrl; // 데스크톱/기타는 구글 템플릿
  }

  /**
   * 유효 예약인지 확인
   */
  private async _checkReservation(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(
      reservationId,
    );

    // 존재하는 예약인지 확인
    if (!reservation) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.RESERVATION_NOT_FOUND);
    }

    // 확정되지 않은 예약일때 예외처리
    if (reservation.status !== RESERVATION_STATUS.confirmed) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.RESERVATION_STATUS_NOT_CONFIRMED,
      );
    }

    return reservation;
  }

  /**
   * ios / android 감지
   * TODO.. ios / android 감지할 수 있는 라이브러리 체크
   */
  private _detectPlatform(uaRaw?: string) {
    const ua = (uaRaw || '').toLowerCase();

    // iOS: iPhone/iPad/iPod. iPadOS(데스크톱 UA) 대응: "Macintosh" + "Mobile"
    const isIOS =
      /iphone|ipad|ipod/.test(ua) ||
      (/\bmacintosh\b/.test(ua) && /\bmobile\b/.test(ua));

    // Android
    const isAndroid = /\bandroid\b/.test(ua);

    return { isIOS, isAndroid };
  }
}
