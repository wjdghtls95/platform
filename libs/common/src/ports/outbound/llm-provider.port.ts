export const LLM_PROVIDER = Symbol('LLM_PROVIDER');

/**
 *
 */
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  language?: 'ko' | 'en' | 'ja';
}

export interface LLMResponse {
  content: string;
  model: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost?: number; // USD
}

export interface LLMProviderPort {
  readonly providerName: string;

  // 채팅 기반 llm 응답 요청
  chat(request: LLMRequest): Promise<LLMResponse>;
  // 해당 provider api 키 유효한지 검사
  validateApiKey(): Promise<boolean>;
}
