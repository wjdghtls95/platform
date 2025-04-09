import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { IsString } from 'class-validator';

export class UserLocationOutDto extends BaseOutDto {
  @ApiProperty({ description: 'kakao docs x (경도 longitude)' })
  @IsString()
  lng: string;

  @ApiProperty({ description: 'kakao docs y (위도 latitude)' })
  @IsString()
  lat: string;
}
