import { Inject, Injectable } from '@nestjs/common';
import { PlatformHttpClient } from '../client/platform-http.client';
import {
  EMAIL_SENDER,
  IEmailSender,
} from '@libs/common/ports/outbound/email-sender.port';
import { SendReservationIcsOutDto } from '@libs/dao/integration/reservation-email/dto/send-reservation-ics-out.dto';
import { SendReservationIcsInDto } from '@libs/dao/integration/reservation-email/dto/send-reservation-ics-in.dto';

@Injectable()
export class ReservationEmailService {
  constructor(
    private readonly platformHttpClient: PlatformHttpClient,

    @Inject(EMAIL_SENDER)
    private readonly emailSender: IEmailSender,
  ) {}

  /**
   * 예약 확정 후 ICS 메일 전송
   */
  async confirmReservation(
    sendReservationIcsInDto: SendReservationIcsInDto,
  ): Promise<SendReservationIcsOutDto> {
    const { token, to, subject } = sendReservationIcsInDto;

    // TODO.. token, to, reservation Id 예외처리 메세지 다시 확인
    if (!token) {
      throw new Error('Token required');
    }

    const { reservationId } =
      await this.platformHttpClient.confirmReservationByToken(token);

    if (!reservationId) {
      throw new Error('ReservationId not found');
    }

    const icsText = await this.platformHttpClient.fetchIcsText(reservationId);

    if (!to) {
      throw new Error('to email required');
    }

    const mail = await this.emailSender.sendIcs(to, subject, icsText);

    return SendReservationIcsOutDto.of(mail);
  }
}
