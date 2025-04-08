import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteOutDto extends BaseOutDto {
  @ApiProperty()
  placeId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  golfCourseId: number;

  @ApiProperty({ example: '2025-04-07T14:32:10Z' })
  createdAt: Date;

  /**
   * TODO.. 다른 open api 로 검색 추가시 provider 주석 해제
   */
  // @ApiProperty()
  // provider: 'kakao' | 'naver';
}
