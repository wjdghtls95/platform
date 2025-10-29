import { LLmGatewayServerConfigModule } from './config/llm-gateway-server-config.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { PromptTemplateService } from './prompt/prompt-template.service';
import { ProviderFactory } from './providers/provider.factory';
import { OpenAIAdapter } from './providers/openai.adapter';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { UsageLoggerInterceptor } from './cost/usage-logger.interceptor';
import { LLMCacheModule } from './cache/llm-cache.module';
/***
 * TODO.. 밑 어댑터 추후에 생성
 * import { ClaudeAdapter } from './providers/claude.adapter';
 * import { GeminiAdapter } from './providers/gemini.adapter';
 */

@Module({
  imports: [
    // config
    LLmGatewayServerConfigModule,
    LLMCacheModule, // LLMService 포함
  ],
  controllers: [ChatController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UsageLoggerInterceptor, // 비용 로깅
    },

    // Services
    ChatService,
    PromptTemplateService,

    // LLM Providers
    // NestJS가 이 클래스들을 인스턴스화하고 DI 컨테이너에 등록
    ProviderFactory, // 팩토리 자체
    OpenAIAdapter, // 팩토리가 주입받을 어댑터 1
  ],
})
export class LLMGatewayModule {}
