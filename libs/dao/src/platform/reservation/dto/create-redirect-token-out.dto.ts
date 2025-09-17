import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class CreateRedirectTokenOutDto extends BaseOutDto {
  @ApiProperty({ description: '리다이렉트 토큰' })
  reservationToken: string;

  @ApiProperty({
    description: '모의 외부 예약 UI로 이동할 URL',
    example:
      'http://localhost:4001/ui/book?provider=naver&ref=rt_ab12cd34&courseId=45&startAt=2025-08-24T07:20:00%2B09:00&endAt=2025-08-24T11:20:00%2B09:00&partySize=3',
  })
  redirectUrl: string;

  @ApiProperty({
    description: '토큰 만료 시각',
  })
  expiresAt: Date;
}
