import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AbstractHttpService } from '@libs/common/networks/abstract-http-service';
import { HTTP_CLIENT_TOKENS } from '@libs/common/constants/http-client.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

/**
 * 옮겨야됨
 */
export interface LlmChatDto {
  userId: number;
  provider: string;
  model: string;
  analysisData?: any;
  language?: string;
}

@Injectable()
export class LLmGatewayProvider extends AbstractHttpService {
  private readonly logger = new Logger(LLmGatewayProvider.name);

  constructor(
    @Inject(HTTP_CLIENT_TOKENS.LLM_GATEWAY)
    llmGatewayHttp: HttpService,
  ) {
    super(llmGatewayHttp, '');
  }

  /**
   * LLM Gateway /chat 호출
   * - SwingAnalysisService.testLlmGateway()에서 사용
   */
  async chat(chatDto: LlmChatDto): Promise<any> {
    try {
      const data = await this.post({
        method: 'chat',
        data: chatDto,
      });
      return data;
    } catch (error: any) {
      this.logger.error(`LlmGateway chat error: ${error.message}`, error.stack);
      throw new ServerErrorException(INTERNAL_ERROR_CODE.LLM_HTTP_ERROR);
    }
  }
}
