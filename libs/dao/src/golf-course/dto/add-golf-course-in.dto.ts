import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddGolfCourseInDto {
  @ApiProperty({ description: '골프장 이름' })
  @IsString()
  courseName: string;

  @ApiProperty({ description: 'kakao docs x (경도 longitude)' })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'kakao docs y (위도 latitude)' })
  @IsNumber()
  lat: number;
}
