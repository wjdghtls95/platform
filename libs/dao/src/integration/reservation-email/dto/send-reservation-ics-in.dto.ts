import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendReservationIcsInDto {
  @ApiProperty({ description: 'platform에서 발급된 리다이렉트 토큰' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: '받는 이메일' })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: '메일 제목',
    required: false,
    default: 'Your Reservation',
  })
  @IsOptional()
  @IsString()
  subject?: string;
}
