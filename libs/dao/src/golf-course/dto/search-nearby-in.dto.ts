import { ExcludeAbstractTimeDto } from '@libs/dao/base/exclude-abstract.time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import {
  KAKAO_CATEGORY_CODE,
  KakaoCategoryCode,
} from '@libs/common/constants/kakao.constants';

export class SearchNearByInDto extends ExcludeAbstractTimeDto {
  @ApiProperty({ description: '위도' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: '경도' })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: '반경' })
  @IsNumber()
  radius: number;

  @ApiProperty({ description: '카테고리', enum: KAKAO_CATEGORY_CODE })
  @IsEnum(KAKAO_CATEGORY_CODE)
  kakaoCategoryCode: KakaoCategoryCode;

  @ApiProperty({ description: '페이지 번호', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: '페이지 사이즈', required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  size?: number = 10;
}
