import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RedisGeoSearchDto {
  @ApiProperty({ description: '골프장 아이디' })
  @IsNumber()
  golfCourseId: number;

  @ApiProperty({ description: 'kakao docs x (경도 longitude)', default: null })
  @IsOptional()
  @IsString()
  lng?: string;

  @ApiProperty({ description: 'kakao docs y (위도 latitude)', default: null })
  @IsOptional()
  @IsString()
  lat?: string;

  @ApiProperty({ description: '반경' })
  @IsNumber()
  radius: number;

  @ApiProperty({ description: '단위', default: 'm' })
  unit: 'm' | 'km';
}
