import { ApiProperty } from '@nestjs/swagger';

export class OAuthUserDto {
  @ApiProperty({ description: 'provider id' })
  providerId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}
