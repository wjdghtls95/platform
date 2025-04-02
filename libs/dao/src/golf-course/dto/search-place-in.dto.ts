import { ExcludeAbstractTimeDto } from '@libs/dao/base/exclude-abstract.time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchPlaceInDto extends ExcludeAbstractTimeDto {
  @ApiProperty({ description: '찾는 장소' })
  @IsString()
  keyword: string;

  @ApiProperty({ description: '페이지 번호', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: '페이지 사이즈', required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  size?: number = 10;
}
