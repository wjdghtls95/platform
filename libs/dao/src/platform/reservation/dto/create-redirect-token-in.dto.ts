import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRedirectTokenInDto {
  @ApiProperty({ description: '유저 아이디' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: '골프장 아이디' })
  @IsNumber()
  @IsNotEmpty()
  golfCourseId: number;

  @ApiProperty({ description: '골프 시작 시간' })
  @IsNotEmpty()
  startAt: Date;

  @ApiProperty({ description: '골프 종료 시간', nullable: true })
  @IsOptional()
  endAt?: Date;

  @ApiProperty({ description: '참가 인원', default: 1 })
  @IsNumber()
  partySize: number;

  @ApiProperty({ description: '예약 사이트', nullable: true, required: false })
  @IsOptional()
  provider?: 'naver' | 'kakao' | 'golfzone';
}
