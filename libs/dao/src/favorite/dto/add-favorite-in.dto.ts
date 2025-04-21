import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  KAKAO_CATEGORY_CODE,
  KakaoCategoryCode,
} from '@libs/common/constants/kakao.constants';

export class AddFavoriteInDto {
  @ApiProperty({ description: '골프장 아이디' })
  @IsNumber()
  golfCourseId: number;

  @ApiProperty({ description: '위치의 고유 아이디' })
  @IsNumber()
  placeId: number;

  @ApiProperty({ description: '장소 이름' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '장소 카테고리',
    enum: Object.keys(KAKAO_CATEGORY_CODE),
  })
  @IsEnum(Object.keys(KAKAO_CATEGORY_CODE))
  category: KakaoCategoryCode;

  @ApiProperty({ description: 'kakao docs x (경도 longitude)' })
  @IsString()
  lng: string;

  @ApiProperty({ description: 'kakao docs y (위도 latitude)' })
  @IsString()
  lat: string;

  /**
   * TODO.. 다른 open api 로 검색 추가시 provider 주석 해제
   */
  // @IsEnum(['kakao', 'naver'])
  // provider: 'kakao' | 'naver';
}
