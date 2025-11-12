import { Inject, Injectable, Logger } from '@nestjs/common';
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
   */
  async uploadLocalSwingFile(
    file: Express.Multer.File,
    userId: number,
  ): Promise<SwingAnalysisOutDto> {
    const form = new FormData();

    // disk storage 사용시
    // form.append('file', fs.createReadStream(file.path));

    // memory storage
    form.append('file', file.buffer, { filename: file.originalname });

    const headers = form.getHeaders();

    // ai 스윙 분석 결과값
    const result = await this.swingAnalysisProvider.post({
      method: 'analyze',
      data: form,
      headers,
    });

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

    try {
      // 게이트웨이의 /chat 엔드포인트 호출
      // (baseURL과 X-Internal-Api-Key 헤더는 platform.module.ts에서 자동 설정됨)
      const result = this.swingAnalysisProvider.post({
        method: 'chat',
        data: chatDto,
      });

      // 게이트웨이로부터 받은 응답 (OpenAI의 답변)
      return result;
    } catch (e) {
      Logger.error('LLM Gateway 호출 실패:', e.response?.data || e.message);

      throw e;
    }
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
