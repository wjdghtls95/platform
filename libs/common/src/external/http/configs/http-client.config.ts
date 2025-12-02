import { HttpClientEnvConfig } from '@libs/common/external/http/interface/http-client.interface';
import { HTTP_CLIENT_TOKENS } from '@libs/common/constants/http-client.constants';

/**
 * Swing Analyzer HTTP Client 설정
 * - FastAPI 서버 (포트 8080)
 * - 스윙 분석 요청 처리
 */
export const swingAnalyzerHttpConfig: HttpClientEnvConfig = {
  name: HTTP_CLIENT_TOKENS.SWING_ANALYZER,
  baseUrlEnv: 'SWING_ANALYZER_URL',
  apiKeyEnv: 'INTERNAL_API_KEY', // 통합 API Key
  apiKeyHeaderName: 'X-Internal-Api-Key',
  timeout: 180000, // 180초 (env의 SWING_ANALYZER_TIMEOUT과 일치)
};

/**
 * LLM Gateway HTTP Client 설정
 * - NestJS 서버 (포트 3002)
 * - LLM API 프록시 역할
 */
export const llmGatewayHttpConfig: HttpClientEnvConfig = {
  name: HTTP_CLIENT_TOKENS.LLM_GATEWAY,
  baseUrlEnv: 'LLM_GATEWAY_URL',
  apiKeyEnv: 'INTERNAL_API_KEY', // 통합 API Key
  apiKeyHeaderName: 'X-Internal-Api-Key',
  timeout: 180000, // 180초 (env의 LLM_GATEWAY_TIMEOUT과 일치)
};

/**
 * Kakao API HTTP Client 설정
 * - Kakao REST API
 * - Authorization 헤더 사용
 */
export const kakaoHttpConfig: HttpClientEnvConfig = {
  name: HTTP_CLIENT_TOKENS.KAKAO,
  baseUrlEnv: 'KAKAO_SEARCH_URI', // env의 KAKAO_SEARCH_URI
  apiKeyEnv: 'KAKAO_API_KEY',
  apiKeyHeaderName: 'Authorization',
  apiKeyPrefix: 'KakaoAK',
  timeout: 5000,
};

/**
 * IP Location HTTP Client 설정
 * - IP 기반 위치 조회 서비스
 * - API Key 불필요
 */
export const ipLocationHttpConfig: HttpClientEnvConfig = {
  name: HTTP_CLIENT_TOKENS.IP_LOCATION,
  baseUrlEnv: 'SEARCH_IP_URI', // env의 SEARCH_IP_URI
  timeout: 3000,
};

/**
 * Google Calendar HTTP Client 설정
 * - Google Calendar API
 */
export const googleCalendarHttpConfig: HttpClientEnvConfig = {
  name: HTTP_CLIENT_TOKENS.GOOGLE_CALENDAR,
  baseUrlEnv: 'CALENDAR_GOOGLE_BASE_URL',
  timeout: 5000,
  // OAuth 사용하므로 apiKeyEnv 없음
};

/**
 * OpenAI HTTP Client 설정
 * - OpenAI API
 * - LLM Gateway에서 사용
 */
export const openaiHttpConfig: HttpClientEnvConfig = {
  name: HTTP_CLIENT_TOKENS.OPENAI,
  baseUrlEnv: 'LLM_OPENAI_API_BASE_URL', // ex) https://api.openai.com/v1
  apiKeyEnv: 'LLM_OPENAI_API_KEY',
  apiKeyHeaderName: 'Authorization', // "Bearer {key}" 형식
  apiKeyPrefix: 'Bearer',
  timeout: 15000, // 60초
};

/**
 * TODO.. LLM 이런식으로 늘려가면 됨
 * Claude HTTP Client 설정
 * - Anthropic Claude API
 * - LLM Gateway에서 사용
 */
// export const claudeHttpConfig: HttpClientEnvConfig = {
//   name: 'CLAUDE',
//   baseUrlEnvKey: 'LLM_CLAUDE_API_BASE_URL', // 또는 직접 'https://api.anthropic.com/v1'
//   apiKeyEnvKey: 'LLM_CLAUDE_API_KEY',
//   apiKeyHeaderName: 'x-api-key', // Claude는 x-api-key 사용
//   timeout: 60000,
// };
