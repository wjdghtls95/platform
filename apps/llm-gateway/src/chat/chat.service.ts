import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ProviderFactory } from '../providers/provider.factory';
import {
  PromptTemplateService,
  SwingAnalysisData,
} from '../prompt/prompt-template.service';
// import { LLMCacheService } from '../cache/llm-cache.service';
import { ChatOutDto } from './dto/chat-out.dto';
import { ChatInDto } from './dto/chat-in.dto';
import { LLMProviderPort } from '@libs/common/ports/outbound/llm-provider.port';

/**
 * 채팅 요청의 핵심 비즈니스 로직을 처리하는 서비스
 * - 프로바이더 선택 (동적)
 * - 캐시 확인
 * - 프롬프트 생성
 * - LLM 호출
 * - 캐시 저장
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly providerFactory: ProviderFactory, // 동적 팩토리 주입
    private readonly promptTemplate: PromptTemplateService, // 프롬프트 생성기 주입 // private readonly cacheService: LLMCacheService, // 캐시 서비스 주입
  ) {}

  /**
   * 컨트롤러로부터 DTO를 받아 LLM 채팅 응답을 처리합니다.
   */
  async processChat(chatOutDto: ChatOutDto): Promise<ChatInDto> {
    // 1. DTO에서 프로바이더 이름 가져오기 (없으면 'openai'가 기본값)
    const providerName = chatOutDto.provider || 'openai';

    this.logger.log(
      `LLM 요청 수신: Provider=${providerName}, Language=${
        chatOutDto.language || 'ko'
      }`,
    );

    // // 2. 캐시 키 생성
    // const cacheKey = this.cacheService.generateKey(chatOutDto);
    //
    // // 3. 캐시 확인
    // try {
    //   const cached = await this.cacheService.get(cacheKey);
    //   if (cached) {
    //     this.logger.log(`캐시 히트 🎯: ${cacheKey}`);
    //     return { ...cached, cached: true }; // 캐시된 응답 반환
    //   }
    //   this.logger.log(`캐시 미스 miss: ${cacheKey}`);
    // } catch (cacheError) {
    //   this.logger.error(
    //     `캐시 조회 실패: ${cacheError.message}`,
    //     cacheError.stack,
    //   );
    //   // 캐시 서버에 장애가 나도, LLM을 호출하여 서비스는 계속되어야 함.
    // }

    // --- (캐시 미스 시, LLM 호출 로직) ---

    // 4. 동적으로 프로바이더(어댑터) 인스턴스 가져오기
    let llmProvider: LLMProviderPort;
    try {
      llmProvider = this.providerFactory.getProvider(providerName);
    } catch (factoryError) {
      this.logger.warn(`프로바이더 선택 실패: ${factoryError.message}`);
      throw new BadRequestException(factoryError.message); // 400 에러
    }

    // 5. 프롬프트 생성
    // (DTO의 analysisData가 SwingAnalysisData 타입과 호환되어야 함)
    const prompt = this.promptTemplate.buildSwingAnalysisPrompt(
      chatOutDto.analysisData as SwingAnalysisData, // 타입 단언
      chatOutDto.language || 'ko',
    );

    // 6. LLM 호출
    // (Adapter에서 에러 발생 시, Adapter가 throw한 예외가
    //  NestJS의 Exception Filter에 의해 처리됨)
    const llmResponse = await llmProvider.chat({
      messages: [
        // OpenAI/Claude 모두 System 프롬프트를 messages 밖이나 안으로 처리 가능
        // 여기서는 PromptTemplateService가 이미 System + User를 합쳤다고 가정
        { role: 'system', content: prompt },
        // User 프롬프트를 분리하고 싶다면 PromptTemplateService 수정 필요
        {
          role: 'user',
          content: '분석 결과를 바탕으로 피드백을 제공해주세요.',
        },
      ],
      model: chatOutDto.model, // DTO에 모델이 명시되면 해당 모델 사용
      temperature: chatOutDto.temperature ?? 0.7,
      maxTokens: 2000,
      language: chatOutDto.language,
    });

    // 7. 최종 응답 DTO 구성
    const chatInDto: ChatInDto = {
      feedback: llmResponse.content,
      model: llmResponse.model,
      tokensUsed: llmResponse.tokensUsed,
      cost: llmResponse.cost,
      cached: false, // 캐시 미스
    };

    // 8. 캐시에 저장 (Non-Blocking)
    // await를 쓰지 않거나, 써도 응답 반환 후 처리되도록 함.
    // this.cacheService
    //   .set(cacheKey, chatInDto, 3600) // 1시간 캐시
    //   .catch((err) => {
    //     this.logger.error(`캐시 저장 실패: ${err.message}`, cacheKey);
    //   });

    this.logger.log(
      `LLM 응답 완료 (${providerName}): 토큰=${
        llmResponse.tokensUsed.total
      }, 비용=$${llmResponse.cost?.toFixed(6)}`,
    );

    return chatInDto;
  }
}
