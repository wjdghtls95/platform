import { ApiProperty } from '@nestjs/swagger';
import { AUTH_TYPE, AuthType } from '@libs/common/constants/auth.constants';
import { IsNotEmpty, IsString } from 'class-validator';
import { ExcludeAbstractTimeDto } from '@libs/dao/platform/base/exclude-abstract.time.dto';

export class RegisterDto extends ExcludeAbstractTimeDto {
  @ApiProperty({ description: '유저 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '유저 닉네임', nullable: true, default: '' })
  nickname?: string;

  @ApiProperty({
    description: '가입 타입 체크',
    enum: AUTH_TYPE,
    default: AUTH_TYPE.EMAIL,
  })
  authType: AuthType;

  @ApiProperty({ description: '유저 이메일' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '비밀번호', nullable: true, default: '' })
  password?: string;

  @ApiProperty({ description: 'OAuth Id', nullable: true, default: null })
  providerId?: string;
}
