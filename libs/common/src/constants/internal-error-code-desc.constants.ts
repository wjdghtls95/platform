import { INTERNAL_ERROR_CODE as e } from './internal-error-code.constants';

export const INTERNAL_ERROR_CODE_DESC = {
  // AUTH
  [e.AUTH_PASSWORD_NOT_FOUND]: '이메일 가입시 비밀번호를 찾을 수 없음',
  [e.AUTH_PROVIDER_ID_NOT_FOUND]: 'OAuth 가입시 id를 찾을 수 없음',
  [e.AUTH_TYPE_INVALID]: 'auth 타입이 유효하지 않음',

  // OAUTH
  [e.OAUTH_GOOGLE_CODE_INVALID]: '구글 authentication code 유효하지 않음',
  [e.OAUTH_GOOGLE_ID_TOKEN_INVALID]: '구글 아이디 토큰이 유효하지 않음',

  // USER
  [e.USER_NOT_FOUND]: '유저 정보를 찾을 수 없음',
  [e.USER_ALREADY_CREATED]: '이미 생성 된 유저',
  [e.USER_EMAIL_INVALID]: '유저 이메일 유효하지 않음',
  [e.USER_PASSWORD_INVALID]: '유저 비밀번호 유효하지 않음',

  // LOGIN
  [e.LOGIN_ACCESS_TOKEN_INVALIDATE]: 'access token 이 유효하지 않음',
  [e.LOGIN_REFRESH_TOKEN_INVALIDATE]: 'refresh token 이 유효하지 않음',
  [e.LOGIN_REFRESH_TOKEN_EXPIRED]: 'refresh token 만료',

  // DATABASE
  [e.DB_UPDATE_FAILED]: 'db 얻데이트 실패',
} as const;
