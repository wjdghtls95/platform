import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';

@Entity()
export class SwingAnalysis extends AbstractEntity {
  @Column({ comment: '유저 아이디' })
  userId: number;

  @Column({ comment: 'FastAPI 에서 생성한 스윙 id' })
  swingId: string;

  @Column({ comment: '팔꿈치 평균 각도', type: 'float' })
  elbowAvgAngle: number;

  @Column({ comment: '스윙 피드백' })
  feedback: string; // FastAPI 에서 전달된 피드백 메시지 (Ex: 너무 펴짐, 적절 등)

  @Column({ comment: 'Mediapipe 가 분석한 유효 프레임 수' })
  landmarkCount: number; // 스윙 품질 판단용

  @Column({ comment: '업로드된 파일 URL', nullable: true })
  s3Url?: string;
}
