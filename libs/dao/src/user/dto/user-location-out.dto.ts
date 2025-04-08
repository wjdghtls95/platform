import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { IsNumber } from 'class-validator';

export class UserLocationOutDto extends BaseOutDto {
  @ApiProperty({ description: 'kakao docs x (경도 longitude)' })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'kakao docs y (위도 latitude)' })
  @IsNumber()
  lat: number;
}
