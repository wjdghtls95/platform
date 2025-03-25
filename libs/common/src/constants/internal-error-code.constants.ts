export const INTERNAL_ERROR_CODE = {
  //AUTH : 1 ~ 10
  AUTH_PASSWORD_NOT_FOUND: 1, // 이메일 가입시 비밀번호를 찾을 수 없음
  AUTH_PROVIDER_ID_NOT_FOUND: 2, // OAuth 가입시 id를 찾을 수 없음
  AUTH_TYPE_INVALID: 3, // auth 타입이 유효하지 않음

  // OAUTH : 11 ~ 20
  OAUTH_GOOGLE_CODE_INVALID: 4, // 구글 authentication code 유효하지 않음
  OAUTH_GOOGLE_ID_TOKEN_INVALID: 5, // 구글 아이디 토큰이 유효하지 않음

  // USER : 21 ~ 30
  USER_NOT_FOUND: 21, // 유저 정보를 찾을 수 없음
  USER_ALREADY_CREATED: 22, // 이미 생성 된 유저
  USER_EMAIL_INVALID: 23, // 유저 이메일 유효하지 않음
  USER_PASSWORD_INVALID: 24, // 유저 비밀번호 유효하지 않음

  // LOGIN : 31 ~ 40
  LOGIN_ACCESS_TOKEN_INVALIDATE: 31, // access token 이 유효하지 않음
  LOGIN_REFRESH_TOKEN_INVALIDATE: 32, // refresh token 이 유효하지 않음
  LOGIN_REFRESH_TOKEN_EXPIRED: 33, // refresh token 만료

  // DATABASE
  DB_UPDATE_FAILED: 9999, // db 업데이트 실패
} as const;

export type InternalErrorCode =
  (typeof INTERNAL_ERROR_CODE)[keyof typeof INTERNAL_ERROR_CODE];
