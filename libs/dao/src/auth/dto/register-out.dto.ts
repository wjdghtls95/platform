import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { AUTH_TYPE, AuthType } from '@libs/common/constants/auth.constants';

export class RegisterOutDto extends BaseOutDto {
  @ApiProperty({ description: '유저 아이디' })
  userId: number;

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

  @ApiProperty({ description: '비밀번호', nullable: true, default: '' })
  password?: string;

  @ApiProperty({ description: 'OAuth Id', nullable: true, default: null })
  providerId?: string;

  // @ApiProperty({
  //   type: DefaultRegisterDto,
  //   description: '이메일 회원가입',
  // })
  // defaultRegisterDto: DefaultRegisterDto;
}
