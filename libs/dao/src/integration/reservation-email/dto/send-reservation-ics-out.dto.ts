import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SendReservationIcsOutDto extends BaseOutDto {
  @ApiProperty()
  reservationId: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  messageId: string;

  @ApiProperty()
  @IsOptional()
  previewUrl?: string;
}
