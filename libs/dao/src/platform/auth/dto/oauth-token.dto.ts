import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class OAuthTokenDto extends BaseOutDto {
  @ApiProperty()
  userId: number;

  @ApiProperty({ required: false, nullable: true })
  name?: string;

  @ApiProperty({ required: false, nullable: true })
  email?: string;

  @ApiProperty()
  accessToken: string;
}

export class OauthTokenDto {}
