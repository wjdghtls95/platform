export const INTERNAL_ERROR_CODE = {
  //AUTH : 1 ~ 10
  AUTH_PASSWORD_NOT_FOUND: 1, // 이메일 가입시 비밀번호를 찾을 수 없음
  AUTH_PROVIDER_ID_NOT_FOUND: 2, // OAuth 가입시 id를 찾을 수 없음

  // USER : 11 ~ 31
  USER_NOT_FOUND: 11, // 유저 정보를 찾을 수 없음
  USER_ALREADY_CREATED: 12, // 이미 생성 된 유저

  // DATABASE
  DB_UPDATE_FAILED: 9999, // db 업데이트 실패
} as const;

export type InternalErrorCode =
  (typeof INTERNAL_ERROR_CODE)[keyof typeof INTERNAL_ERROR_CODE];
