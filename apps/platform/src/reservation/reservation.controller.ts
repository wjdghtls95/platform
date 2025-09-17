import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { CreateRedirectTokenOutDto } from '@libs/dao/platform/reservation/dto/create-redirect-token-out.dto';
import { CreateRedirectTokenInDto } from '@libs/dao/platform/reservation/dto/create-redirect-token-in.dto';
import { ConfirmReservationOutDto } from '@libs/dao/platform/reservation/dto/confirm-reservation-out.dto';

@Controller('reservation')
@ApiTags('Reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('/token')
  @ApiResponseEntity({ summary: '예약 리다이렉트 토큰 발급 (모의 외부 예약)' })
  async createRedirectToken(
    @Body() createRedirectTokenInDto: CreateRedirectTokenInDto,
  ): Promise<ResponseEntity<CreateRedirectTokenOutDto>> {
    const createRedirectTokenOutDto =
      await this.reservationService.createRedirectToken(
        createRedirectTokenInDto,
      );

    return ResponseEntity.ok().body(createRedirectTokenOutDto);
  }

  @Post('/confirm')
  @ApiResponseEntity({ summary: '유저가 확정 토큰으로 예약 생성' })
  async confirm(
    @Query('token') token: string,
  ): Promise<ResponseEntity<ConfirmReservationOutDto>> {
    const confirmReservationOutDto =
      await this.reservationService.confirmByToken(token);

    return ResponseEntity.ok().body(confirmReservationOutDto);
  }
}
