import { ApiProperty } from '@nestjs/swagger';

/**
 * /llm-gateway/chat 엔드포인트의 최종 응답 형식을 정의
 * FastAPI Analyzer가 이 DTO를 받게 됨
 */
export class ChatInDto {
  @ApiProperty({ description: 'LLM이 생성한 최종 피드백 텍스트' })
  feedback: string;

  @ApiProperty({ description: '실제 사용된 LLM 모델명' })
  model: string;

  @ApiProperty({ description: '토큰 사용량 (prompt, completion, total)' })
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };

  @ApiProperty({ description: '예상 비용 (USD)', required: false })
  cost?: number;

  @ApiProperty({ description: '이 응답이 캐시에서 반환되었는지 여부' })
  cached: boolean;
}
