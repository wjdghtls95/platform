import { ApiProperty } from '@nestjs/swagger';
import { AUTH_TYPE, AuthType } from '@libs/common/constants/auth.constants';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInDto {
  @ApiProperty({ description: '로그인 이메일' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '로그인 비밀번호' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '회원가입 타입',
    enum: AUTH_TYPE,
    default: AUTH_TYPE.EMAIL,
  })
  @IsString()
  @IsNotEmpty()
  authType: AuthType;
}
