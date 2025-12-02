import {
  swingAnalyzerHttpConfig,
  llmGatewayHttpConfig,
  kakaoHttpConfig,
  ipLocationHttpConfig,
  googleCalendarHttpConfig,
} from './http-client.config';
import { HttpClientEnvConfig } from '@libs/common/external/http/interface/http-client.interface';

/**
 * Platform 앱에서 사용하는 HTTP Client 설정 모음
 *
 * Platform은 모든 외부 서비스와 통신
 * - Swing Analyzer: 스윙 분석
 * - LLM Gateway: AI 기능
 * - Kakao API: 카카오 지도 검색
 * - IP Location: 위치 기반 서비스
 * - Google Calendar: 캘린더 연동
 */
export const platformHttpConfigs: HttpClientEnvConfig[] = [
  swingAnalyzerHttpConfig,
  llmGatewayHttpConfig,
  kakaoHttpConfig,
  ipLocationHttpConfig,
  googleCalendarHttpConfig,
];
