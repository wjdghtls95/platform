import {
  Injectable,
  Logger,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { LLMProviderPort } from '@libs/common/ports/outbound/llm-provider.port';
import { OpenAIAdapter } from './openai.adapter';
// import { ClaudeAdapter } from './claude.adapter';
// import { GeminiAdapter } from './gemini.adapter'; // 향후 확장

/**
 * 동적으로 LLM 프로바이더(어댑터)를 선택하고 반환하는 '팩토리' 클래스
 */
@Injectable()
export class ProviderFactory implements OnModuleInit {
  private readonly logger = new Logger(ProviderFactory.name);

  // providerName(string)을 키로, 어댑터 인스턴스를 값으로 갖는 맵
  private providerMap: Map<string, LLMProviderPort> = new Map();

  constructor(
    /**
     * NestJS의 DI 시스템이 모듈에 등록된 모든 어댑터 주입
     * ex)
     * private readonly geminiAdapter: GeminiAdapter,
     * private readonly claudeAdapter: ClaudeAdapter,
     */
    private readonly openAIAdapter: OpenAIAdapter,
  ) {}

  /**
   * NestJS 모듈이 초기화될 때(OnModuleInit) 호출됩니다.
   * 주입받은 어댑터 인스턴스들을 맵에 등록합니다.
   */
  onModuleInit() {
    // 주입받은 어댑터들을 배열로 만듭니다.
    const providers: LLMProviderPort[] = [
      this.openAIAdapter,
      // this.geminiAdapter,
      // this.claudeAdapter,
    ];

    // 각 어댑터의 providerName을 키로 사용하여 맵에 저장
    for (const provider of providers) {
      this.providerMap.set(provider.providerName, provider);
      this.logger.log(`LLM Provider 등록됨: ${provider.providerName}`);
    }
  }

  /**
   * ChatService에서 이 메서드를 호출하여
   * 요청에 맞는 프로바이더(어댑터) 인스턴스를 가져옴
   *
   * @param providerName 'openai', 'claude' 등 DTO로 받은 문자열
   * @returns 해당 어댑터 인스턴스 (LLMProviderPort 타입)
   */
  getProvider(providerName: string): LLMProviderPort {
    const provider = this.providerMap.get(providerName);

    // 맵에 없는 프로바이더를 요청하면 에러 발생
    if (!provider) {
      throw new BadRequestException(
        `지원하지 않는 LLM Provider입니다: ${providerName}. ` +
          `사용 가능: [${[...this.providerMap.keys()].join(', ')}]`,
      );
    }
    return provider;
  }
}
