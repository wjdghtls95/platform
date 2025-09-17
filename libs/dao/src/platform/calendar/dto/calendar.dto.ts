import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CalendarLinkOutDto extends BaseOutDto {
  @ApiProperty()
  googleTemplateUrl: string; // calendar url 인지 확인

  @ApiProperty()
  icsUrl: string;

  @ApiProperty()
  webCalUrl: string;
}

export class IcsTextOutDto extends BaseOutDto {
  @ApiProperty()
  icsText: string;
}
