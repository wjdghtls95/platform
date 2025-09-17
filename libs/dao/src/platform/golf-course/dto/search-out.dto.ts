import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class SearchOutDto<T = unknown> extends BaseOutDto {
  @ApiProperty({ description: '검색된 총 개수' })
  totalCount: number;

  @ApiProperty({ description: '마지막 페이지 여부' })
  isEnd: boolean;

  @ApiProperty({ description: '검색 결과 리스트' })
  documents: T[];
}
