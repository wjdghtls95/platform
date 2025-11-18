import { Inject, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import { SwingAnalysisRepository } from '@libs/dao/platform/swing-analysis/swing-analysis.repository';
import { SwingAnalysisOutDto } from '@libs/dao/platform/swing-analysis/dto/swing-analysis-out.dto';
import { SwingAnalysis } from '@libs/dao/platform/swing-analysis/swing-analysis.entity';
import { SwingAnalysisProvider } from '@libs/common/external/swing-analysis/swing-analysis.provider';

@Injectable()
export class SwingAnalysisService {
  constructor(
    @Inject(SwingAnalysisRepository)
    private readonly swingAnalysisRepository: SwingAnalysisRepository,

    private readonly swingAnalysisProvider: SwingAnalysisProvider,
  ) {}

  /**
   * 로컬 스윙 영상 업로드
   * TODO.. 유저 정보 조회 및 모델 결정을 보내야됨
   * const user = await this.usersRepository.findById(userId);
   * const modelName = 'gpt-4o-mini'; // 기본값 (추후 user.isPremium ? 'gpt-4o' : 'gpt-4o-mini' 로 확장 가능
   */
  async uploadLocalSwingFile(
    file: Express.Multer.File,
    userId: number,
  ): Promise<SwingAnalysisOutDto> {
    // disk storage 사용시
    // form.append('file', fs.createReadStream(file.path));
    const form = new FormData();

    // memory storage
    form.append('file', file.buffer, { filename: file.originalname });

    // ai 스윙 분석 결과값
    const result = await this.swingAnalysisProvider.postAnalyzeRequest(form);

    await this.swingAnalysisRepository.insert(
      SwingAnalysis.create({
        userId: userId,
        swingId: result.swingId,
        elbowAvgAngle: result.elbowAvgAngle,
        feedback: result.feedback,
        landmarkCount: result.landmarkCount,
      }),
    );

    return SwingAnalysisOutDto.of({
      userId: userId,
      swingId: result.swingId,
      elbowAvgAngle: result.elbowAvgAngle,
      feedback: result.feedback,
      landmarkCount: result.landmarkCount,
    });
  }

  /**
   * LLM 게이트웨이 호출 테스트용 메소드
   */
  async testLLmGateway(): Promise<any> {
    // env=test 가 아니면 실행 불가
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Invalid Environment');
    }

    // apps/llm-gateway/src/chat/dto/chat-out.dto.ts 참고
    const chatDto = {
      userId: 1,
      provider: 'openai',
      model: 'gpt-4o-mini',
      analysisData: {
        backswingAngle: 0,
        downswingAngle: 0,
        impactAngle: 0,
        errors: [],
      }, // 필요시 스윙 분석 데이터
      language: 'ko',
    };

    const checkGatewayConnection =
      await this.swingAnalysisProvider.checkGatewayConnection(chatDto);

    return checkGatewayConnection;
  }

  /**
   * S3 스윙 영상 업로드
   */
  async uploadS3SwingFile(): Promise<void> {
    /**
     * TODO.. s3 업로드
     */
  }
}
