import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteOutDto extends BaseOutDto {
  @ApiProperty({ description: 'Open API 장소 ID' })
  placeId: number;

  @ApiProperty({ description: '장소 이름' })
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ description: '골프장 아이디' })
  golfCourseId: number;

  @ApiProperty({
    description: '생성 날짜',
    example: '2025-04-07T14:32:10Z',
    default: `${new Date()}`,
  })
  createdAt: Date;

  /**
   * TODO.. 다른 open api 로 검색 추가시 provider 주석 해제
   */
  // @ApiProperty()
  // provider: 'kakao' | 'naver';
}
