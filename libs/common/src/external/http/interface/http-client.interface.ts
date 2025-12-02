/**
 * 환경변수 기반 설정 인터페이스
 */
export interface HttpClientEnvConfig {
  // 서비스 이름
  name: string;

  // Base URL 환경변수 키
  baseUrlEnv: string;

  // API Key 환경변수 키 (선택)
  apiKeyEnv?: string;

  // API Key 헤더 이름 (기본: 'X-Internal-Api-Key')
  apiKeyHeaderName?: string;

  // API Key Prefix (예: 'Bearer', 'KakaoAK')
  apiKeyPrefix?: string;

  // Content-Type (기본: 'application/json')
  contentType?: string;

  // User-Agent (선택)
  userAgent?: string;

  // 추가 헤더
  extraHeaders?: Record<string, any>;

  // 타임아웃
  timeout?: number;

  //최대 리다이렉트 (default: 5)
  maxRedirects?: number;
}

/**
 * HTTP Client 설정 인터페이스
 */
export interface HttpClientConfig {
  // 서비스 이름 (주입 시 사용)
  name: string;

  // Base URL (환경변수 키 또는 직접 값)
  baseURL: string;

  // 헤더 설정
  headers?: Record<string, any>;

  // 타임아웃 (밀리초)
  timeout?: number;

  // 최대 리다이렉트
  maxRedirects?: number;
}

/**
 * HTTP Client 기본값
 */
export const HTTP_CLIENT_DEFAULTS = {
  TIMEOUT: 5000,
  MAX_REDIRECTS: 5,
  CONTENT_TYPE: 'application/json',
} as const;
