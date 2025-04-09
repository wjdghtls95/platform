import { ExcludeAbstractTimeDto } from '@libs/dao/base/exclude-abstract.time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';
import {
  KAKAO_CATEGORY_CODE,
  KakaoCategoryCode,
} from '@libs/common/constants/kakao.constants';

export class SearchNearByInDto extends ExcludeAbstractTimeDto {
  @ApiProperty({ description: 'kakao docs x (경도 longitude)' })
  @IsString()
  lng: string;

  @ApiProperty({ description: 'kakao docs y (위도 latitude)' })
  @IsString()
  lat: string;

  @ApiProperty({ description: '반경 (m)', default: 2000 })
  @IsNumber()
  radius: number;

  @ApiProperty({
    description: 'kakao 카테고리',
    enum: Object.keys(KAKAO_CATEGORY_CODE),
  })
  @IsEnum(Object.keys(KAKAO_CATEGORY_CODE))
  category: KakaoCategoryCode;

  @ApiProperty({ description: '페이지 번호', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: '페이지 사이즈', required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  size?: number = 10;
}
