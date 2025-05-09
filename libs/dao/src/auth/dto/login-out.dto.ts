import { ApiProperty } from '@nestjs/swagger';
import { DomainDto } from '@libs/common/domain/dto/domain.dto';

export class LoginOutDto extends DomainDto {
  @ApiProperty({ description: '유저 닉네임' })
  nickname: string;

  @ApiProperty({ description: '유저 이메일' })
  email: string;

  @ApiProperty({ description: '유저 비밀번호' })
  password: string;

  @ApiProperty({ description: 'access token' })
  accessToken: string;

  @ApiProperty({ description: 'refresh token' })
  refreshToken?: string;

  @ApiProperty({ description: '만료 기간' })
  expiresIn: number;

  setToken(token: string): LoginOutDto {
    this.accessToken = token;
    return this;
  }
}
