import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GolfCourseOutDto extends BaseOutDto {
  @ApiProperty({ description: '골프장 이름' })
  @IsString()
  courseName: string;

  @ApiProperty({ description: 'kakao docs x (경도 longitude)' })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'kakao docs y (위도 latitude)' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: '주소' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '전화번호' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '장소 url' })
  @IsOptional()
  @IsString()
  website?: string;
}
