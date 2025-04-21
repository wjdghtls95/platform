import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddGolfCourseInDto {
  @ApiProperty({ description: '골프장 이름' })
  @IsString()
  golfCourseName: string;

  @ApiProperty({ description: 'kakao docs x (경도 longitude)' })
  @IsString()
  lng: string;

  @ApiProperty({ description: 'kakao docs y (위도 latitude)' })
  @IsString()
  lat: string;

  @ApiProperty({ description: '주소', default: null })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '전화번호', default: null })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '장소 url', default: null })
  @IsOptional()
  @IsString()
  website?: string;
}
