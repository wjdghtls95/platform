import { ExcludeAbstractTimeDto } from '@libs/dao/platform/base/exclude-abstract.time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AUTH_TYPE, AuthType } from '@libs/common/constants/auth.constants';

/**
 * 이메일 회원가입 dto
 */
export class DefaultRegisterDto extends ExcludeAbstractTimeDto {
  @ApiProperty({ description: '유저 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '유저 이메일' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '가입 타입 체크',
    enum: AUTH_TYPE,
    default: AUTH_TYPE.EMAIL,
  })
  authType: AuthType;

  @ApiProperty({ description: '비밀번호', default: null })
  password?: string;
}
