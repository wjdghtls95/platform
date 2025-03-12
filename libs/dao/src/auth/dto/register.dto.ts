import { ApiProperty } from '@nestjs/swagger';
import { AUTH_TYPE } from '@libs/common/constants/auth.constants';
import { IsNotEmpty, IsString } from 'class-validator';
import { ExcludeAbstractTimeDto } from '@libs/dao/base/exclude-abstract.time.dto';

export class RegisterDto extends ExcludeAbstractTimeDto {
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

  @ApiProperty({ description: '비밀번호', nullable: true, default: '' })
  password?: string;

  @ApiProperty({ description: 'OAuth Id', nullable: true, default: null })
  providerId?: string;
}
