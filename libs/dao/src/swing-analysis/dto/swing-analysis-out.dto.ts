import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SwingAnalysisOutDto extends BaseOutDto {
  @ApiProperty({ description: '유저 아이디' })
  userId: number;

  @ApiProperty({ description: 'FastAPI 에서 생성한 스윙 id' })
  swingId: string;

  @ApiProperty({ description: '팔꿈치 평균 각도' })
  elbowAvgAngle: number;

  @ApiProperty({ description: '스윙 피드백' })
  feedback: string; // FastAPI 에서 전달된 피드백 메시지 (Ex: 너무 펴짐, 적절 등)

  @ApiProperty({ description: 'MediaPipe 가 분석한 유효 프레임 수' })
  landmarkCount: number; // 스윙 품질 판단용
}
