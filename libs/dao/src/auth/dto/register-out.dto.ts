import { AUTH_TYPE } from '@libs/common/constants/auth.constants';
import { ExcludeAbstractTimeDto } from '@libs/dao/base/exclude-abstract.time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 이메일 회원가입 dto
 */
export class EmailAuthOutDto extends ExcludeAbstractTimeDto {
  @ApiProperty({ description: '유저 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '유저 이메일' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '가입 타입 체크', default: AUTH_TYPE.EMAIL })
  authType: number;

  @ApiProperty({ description: '비밀번호', default: null })
  password?: string;
}

/**
 * OAuth 회원가입 dto
 */
export class OAuthOutDto extends ExcludeAbstractTimeDto {
  @ApiProperty({ description: '유저 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '유저 이메일' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '가입 타입 체크', default: AUTH_TYPE.EMAIL })
  authType: number;

  @ApiProperty({ description: '비밀번호', default: null })
  password?: string;
}
