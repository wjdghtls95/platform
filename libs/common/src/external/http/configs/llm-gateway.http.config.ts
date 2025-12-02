import { HttpClientEnvConfig } from '@libs/common/external/http/interface/http-client.interface';
import { openaiHttpConfig } from '@libs/common/external/http/configs/http-client.config';

/**
 * LLM Gateway 앱에서 사용하는 HTTP Client 설정 모음
 *
 * LLM Gateway는 외부 LLM Provider와 통신:
 * - OpenAI: GPT 모델
 */
export const llmGatewayAppHttpConfigs: HttpClientEnvConfig[] = [
  openaiHttpConfig,
];
