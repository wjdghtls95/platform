import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteInDto {
  @ApiProperty({ description: '골프장 아이디' })
  @IsNumber()
  golfCourseId: number;

  @ApiProperty({ description: '위치의 고유 아이디' })
  @IsString()
  placeId: string;

  @ApiProperty({ description: '장소 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '장소 카테고리' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'kakao docs x (경도 longitude)' })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'kakao docs y (위도 latitude)' })
  @IsNumber()
  lat: number;

  /**
   * TODO.. 다른 open api 로 검색 추가시 provider 주석 해제
   */
  // @IsEnum(['kakao', 'naver'])
  // provider: 'kakao' | 'naver';
}
