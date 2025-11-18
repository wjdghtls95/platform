import {
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// analysisData 내부 객체에 대한 유효성 검사
class SwingAnalysisDataDto {
  @ApiProperty()
  @IsNumber()
  backswingAngle: number;

  @ApiProperty()
  @IsNumber()
  downswingAngle: number;

  @ApiProperty()
  @IsNumber()
  impactAngle: number;

  @ApiProperty()
  @IsString({ each: true })
  errors: string[];
}

/**
 * FastAPI Analyzer가 /llm-gateway/chat 으로 보낼
 * POST Body의 형식을 정의하고 유효성을 검사합니다.
 */
export class ChatOutDto {
  @ApiProperty({
    description: '스윙 분석 데이터 (JSON)',
    type: SwingAnalysisDataDto,
  })
  @IsObject()
  @ValidateNested() // 내부 객체도 유효성 검사
  @Type(() => SwingAnalysisDataDto) // 클래스 변환
  analysisData: SwingAnalysisDataDto;

  @ApiProperty({ description: '요청 유저 ID' })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: '응답 언어',
    enum: ['ko', 'en'],
    default: 'ko',
    required: false,
  })
  @IsOptional()
  @IsEnum(['ko', 'en'])
  language?: 'ko' | 'en';

  @ApiProperty({
    description: 'LLM 제공자 (ex. openai, gemini, claude)',
    required: false,
    default: 'openai',
  })
  @IsOptional()
  @IsString()
  provider?: string; // 'openai', 'claude' 등 팩토리가 아는 이름

  @ApiProperty({ description: 'LLM 모델명 (예: gpt-4o-mini)', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'Temperature (0-2)',
    default: 0.4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  temperature?: number;
}
