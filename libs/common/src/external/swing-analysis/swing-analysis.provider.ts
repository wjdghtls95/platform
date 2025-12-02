import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AbstractHttpService } from '../../networks/abstract-http-service';
import { SwingAnalysisOutDto } from '@libs/dao/platform/swing-analysis/dto/swing-analysis-out.dto';
import FormData from 'form-data';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { HTTP_CLIENT_TOKENS } from '@libs/common/constants/http-client.constants';

@Injectable()
export class SwingAnalysisProvider extends AbstractHttpService {
  private readonly logger = new Logger(SwingAnalysisProvider.name);

  constructor(
    @Inject(HTTP_CLIENT_TOKENS.SWING_ANALYZER) swingAnalyzerHttp: HttpService,
  ) {
    super(swingAnalyzerHttp, '');
  }

  /**
   * Analyzer로 스윙 분석 요청 (프로덕션)
   */
  async postAnalyzeRequest(formData: FormData): Promise<SwingAnalysisOutDto> {
    try {
      const headers = formData.getHeaders();

      const data = await this.post<SwingAnalysisOutDto>({
        method: 'analyze/direct',
        data: formData,
        headers,
      });

      return data;
    } catch (error) {
      this.logger.error(
        `postAnalyzeRequest error: ${error.message}`,
        error.stack,
      );
      throw new ServerErrorException(INTERNAL_ERROR_CODE.LLM_HTTP_ERROR);
    }
  }

  /**
   * [Test] Analyzer 테스트 모드 요청 (JSON)
   * Path: /analyze/run
   * 비용이 들지 않는 'noop' 모드로 동작함
   */
  async sendTestRequest(testPayload: any): Promise<any> {
    try {
      const data = await this.post({
        method: 'analyze/run',
        data: testPayload,
      });

      return data;
    } catch (error) {
      this.logger.error(`Analyzer Test Error: ${error.message}`, error.stack);
      throw new ServerErrorException(INTERNAL_ERROR_CODE.LLM_HTTP_ERROR);
    }
  }
}
