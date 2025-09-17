import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '@libs/common/constants/reservation-status.constants';

export class ConfirmReservationOutDto extends BaseOutDto {
  @ApiProperty({ description: '예약 아이디' })
  reservationId: number;

  @ApiProperty({ description: '예약 상태' })
  status: ReservationStatus;

  @ApiProperty({
    description: 'ICS 다운로드 URL',
    nullable: true,
    required: false,
  })
  icsUrl?: string;

  @ApiProperty({
    description: 'WebCal 다운로드 URL',
    nullable: true,
    required: false,
  })
  webcalUrl?: string;
}
