import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  LLMProviderPort,
  LLMRequest,
  LLMResponse,
} from '@libs/common/ports/outbound/llm-provider.port';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

/**
 * Open Api 연동을 담당하는 어댑터
 */
@Injectable()
export class OpenAIAdapter implements LLMProviderPort {
  readonly providerName = 'openai';

  private readonly logger = new Logger(OpenAIAdapter.name);
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('LLM_OPENAI_API_KEY');

    if (!apiKey) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.LLM_API_KEY_INVALID);
    }

    this.client = new OpenAI({ apiKey });
  }

  /**
   * OpenAI의 Chat Completion API를 호출
   */
  async chat(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    const model = request.model || 'gpt-4o-mini'; // 기본 모델 설정

    try {
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens,
      });

      const response = completion.choices[0].message;
      const usage = completion.usage;

      if (!response || !usage) {
        throw new InternalServerErrorException('OpenAI 응답이 비정상입니다.');
      }

      // 비용 계산 (모델별로 달라져야 하지만, 여기서는 예시로 gpt-4o-mini 기준)
      // GPT-4o-mini: $0.15/1M input, $0.60/1M output (2024-07 기준)
      const cost =
        (usage.prompt_tokens * 0.15) / 1_000_000 +
        (usage.completion_tokens * 0.6) / 1_000_000;

      this.logger.log(
        `OpenAI (${model}) 요청 완료: ${Date.now() - startTime}ms, ` +
          `토큰: ${usage.total_tokens}, 비용: $${cost.toFixed(6)}`,
      );

      return {
        content: response.content || '',
        model: completion.model,
        tokensUsed: {
          prompt: usage.prompt_tokens,
          completion: usage.completion_tokens,
          total: usage.total_tokens,
        },
        cost,
      };
    } catch (error) {
      this.logger.error(`OpenAI API 호출 실패: ${error.message}`, error.stack);

      // NestJS가 이 예외를 가로채서 500번대 에러로 변환
      throw new InternalServerErrorException(
        `OpenAI API 호출 실패: ${error.message}`,
      );
    }
  }

  /**
   * OpenAI API 키 유효성 검사 (ex. 간단히 모델 목록 조회)
   */
  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.models.list();
      this.logger.log('OpenAI API 키가 유효');
      return true;
    } catch (error) {
      this.logger.error('OpenAI API 키가 유효하지 않음', error.message);
      return false;
    }
  }
}
