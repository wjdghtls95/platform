import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AbstractHttpService } from '../../networks/abstract-http-service';
import { SwingAnalysisOutDto } from '@libs/dao/platform/swing-analysis/dto/swing-analysis-out.dto';
import FormData from 'form-data';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Request } from 'express';

@Injectable()
export class SwingAnalysisProvider extends AbstractHttpService {
  private readonly logger = new Logger(SwingAnalysisProvider.name);

  private readonly internalApiKey: string;
  private readonly gatewayUrl: string;
  private readonly timeout: number;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    // Analyzer URL (http://localhost:8080)
    super(httpService, configService.get<string>('SWING_ANALYZER_URL'));

    // Gateway URL (http://localhost:3002)
    this.gatewayUrl = this.configService.get<string>('LLM_GATEWAY_URL');
    this.internalApiKey = this.configService.get<string>('INTERNAL_API_KEY');
    this.timeout = this.configService.get<number>(
      'SWING_ANALYZER_TIMEOUT',
      180000,
    );
  }

  /**
   * Analyzer로 스윙 분석 요청 (프로덕션)
   */
  async postAnalyzeRequest(formData: FormData): Promise<SwingAnalysisOutDto> {
    try {
      const formHeaders = formData.getHeaders();

      const headers = {
        ...formHeaders,
        'X-Internal-Api-Key': this.internalApiKey, // (인증) 서비스 인증
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/analyze/direct`, formData, {
          headers,
          timeout: this.timeout,
        }),
      );
      return response.data;
    } catch (error) {
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
      const headers = {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': this.internalApiKey,
      };

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/analyze/run`, // Analyzer 테스트 엔드포인트
          testPayload,
          { headers, timeout: this.timeout },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Analyzer Test Error: ${error.message}`, error.stack);
      throw new ServerErrorException(INTERNAL_ERROR_CODE.LLM_HTTP_ERROR);
    }
  }

  /**
   * [Debug] Gateway 직접 연결 확인 (Connectivity Check)
   * Path: /chat
   */
  async checkGatewayConnection(chatDto: any): Promise<any> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': this.internalApiKey,
      };

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.gatewayUrl}/chat`, // Gateway 직접 호출
          chatDto,
          { headers, timeout: 30000 },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Gateway Connection Error: ${error.message}`,
        error.stack,
      );
      throw new ServerErrorException(INTERNAL_ERROR_CODE.LLM_HTTP_ERROR);
    }
  }
}
