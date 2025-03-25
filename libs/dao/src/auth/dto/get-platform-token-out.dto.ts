import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetPlatformTokenOutDto extends BaseOutDto {
  @ApiProperty({ description: '플랫폼 토큰' })
  platformToken: string;
}
