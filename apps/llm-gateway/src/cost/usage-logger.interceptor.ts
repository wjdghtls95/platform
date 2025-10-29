import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { ChatInDto } from '../chat/dto/chat-in.dto';
import { TimeUtil } from '@libs/common/utils/time.util';

/**
 * LLM 사용량 로깅 Interceptor
 *
 * 모든 LLM 요청/응답을 가로채서:
 * - 비용 (USD)
 * - 토큰 사용량
 * - 모델 정보
 * - 응답 시간
 * - 캐시 히트 여부
 * 를 로깅합니다.
 *
 * 향후 확장:
 * - DB에 저장하여 대시보드 생성
 * - 알림 (비용 임계값 초과 시)
 * - 사용자별/모델별 통계
 */
@Injectable()
export class UsageLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('LLMUsageTracker');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body, ip } = request;

    const startTime = Date.now();

    // 요청 로깅
    this.logger.log(
      `→ LLM Request: ${method} ${url} | ` +
        `IP: ${ip} | ` +
        `Provider: ${body?.provider || 'default'}`,
    );

    return next.handle().pipe(
      tap({
        next: (chatInDto: ChatInDto) => {
          const duration = TimeUtil.diff(startTime);

          // LLM 응답인지 확인 (cost 필드로 판별)
          if (chatInDto && typeof chatInDto.cost === 'number') {
            this.logger.log(
              `✓ LLM Response: ${method} ${url} | ` +
                `Provider: ${body?.provider || 'openai'} | ` +
                `Model: ${chatInDto.model} | ` +
                `Tokens: ${chatInDto.tokensUsed.total} ` +
                `(prompt: ${chatInDto.tokensUsed.prompt}, completion: ${chatInDto.tokensUsed.completion}) | ` +
                `Cost: $${chatInDto.cost.toFixed(6)} | ` +
                `Duration: ${TimeUtil.format(duration)} | ` +
                `Cached: ${chatInDto.cached ? '🎯 HIT' : '❌ MISS'}`,
            );

            // TODO: 향후 DB 저장
            // await this.saveUsageToDatabase({
            //   timestamp: new Date(),
            //   provider: body?.provider || 'openai',
            //   model: data.model,
            //   tokensUsed: data.tokensUsed,
            //   cost: data.cost,
            //   duration,
            //   cached: data.cached,
            //   endpoint: url,
            // });

            // TODO: 비용 알림 (임계값 초과 시)
            // if (data.cost > 0.1) {
            //   this.logger.warn(`⚠️ High cost request: $${data.cost}`);
            // }
          } else {
            // LLM 응답이 아닌 경우 (health check 등)
            this.logger.log(
              `✓ Response: ${method} ${url} | Duration: ${TimeUtil.format(
                duration,
              )}`,
            );
          }
        },
        error: (error: Error) => {
          const duration = TimeUtil.diff(startTime);

          this.logger.error(
            `✗ LLM Error: ${method} ${url} | ` +
              `Duration: ${TimeUtil.format(duration)} | ` +
              `Error: ${error.message}`,
            error.stack,
          );

          // TODO: 에러 알림
          // await this.sendErrorAlert({
          //   endpoint: url,
          //   error: error.message,
          //   timestamp: new Date(),
          // });
        },
      }),
    );
  }

  /**
   * (향후 확장) DB에 사용량 저장
   */
  // private async saveUsageToDatabase(usage: LlmUsageLog): Promise<void> {
  //   try {
  //     await this.usageRepository.save(usage);
  //   } catch (error) {
  //     this.logger.error(`Failed to save usage log: ${error.message}`);
  //   }
  // }
}
