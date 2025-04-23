import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as FormData from 'form-data';
import { SwingAnalysisProvider } from '@libs/common/external/swing-analysis/swing-analysis.provider';
import { SwingAnalysisRepository } from '@libs/dao/swing-analysis/swing-analysis.repository';
import { SwingAnalysisOutDto } from '@libs/dao/swing-analysis/dto/swing-analysis-out.dto';
import { SwingAnalysis } from '@libs/dao/swing-analysis/swing-analysis.entity';

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
    file: any,
    userId: number,
  ): Promise<SwingAnalysisOutDto> {
    const form = new FormData();

    form.append('file', fs.createReadStream(file.path));

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
        sourceType: 'direct',
        filePath: file.path,
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
   * S3 스윙 영상 업로드
   */
  async uploadS3SwingFile(): Promise<void> {
    /**
     * TODO.. s3 업로드
     */
  }
}
