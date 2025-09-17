import { Body, Controller, Post } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ReservationEmailService } from './reservation-email.service';
import { SendReservationIcsOutDto } from '@libs/dao/integration/reservation-email/dto/send-reservation-ics-out.dto';
import { SendReservationIcsInDto } from '@libs/dao/integration/reservation-email/dto/send-reservation-ics-in.dto';
import { ResponseEntity } from '@libs/common/networks/response-entity';

@Controller('reservation-email')
@ApiSecurity('api-key')
@ApiTags('Reservation Email')
export class ReservationEmailController {
  constructor(
    private readonly reservationEmailService: ReservationEmailService,
  ) {}

  @Post('confirm')
  async confirmReservation(
    @Body() sendReservationIcsInDto: SendReservationIcsInDto,
  ): Promise<ResponseEntity<SendReservationIcsOutDto>> {
    // TODO.. 여기 ResponseEntity 사용하는게 맞는지 다시 체크
    const sendReservationIcsOutDto =
      await this.reservationEmailService.confirmReservation(
        sendReservationIcsInDto,
      );

    return ResponseEntity.ok().body(sendReservationIcsOutDto);
  }
}
