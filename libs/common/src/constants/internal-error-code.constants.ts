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

  // API SECURITY : 41 ~ 50
  API_SECURITY_AUTH_TOKEN_INVALIDATE: 41, // authToken 유효하지 않음

  // GOLF COURSE : 51 ~ 70
  GOLF_COURSE_NOT_FOUND: 51, // 리스트에 등록되지 않은 골프장
  GOLF_COURSE_ALREADY_CREATED: 52, // 리스트에 이미 등록된 골프장

  // FAVORITE PLACE : 71 ~ 90
  FAVORITE_PLACE_ALREADY_EXISTED: 71, // 즐겨찾기에 이미 존재
  FAVORITE_PLACE_SAVE_FAILED: 72, // 즐겨찾기 저장 실패
  FAVORITE_PLACE_DELETE_FAILED: 73, // 즐겨찾기 삭제 실패

  // RESERVATION : 91 ~ 100
  RESERVATION_INVALID_START_AT: 91, // 예약 시작시간 유효하지 않음
  RESERVATION_NOT_FOUND: 92, // 예약을 찾지 못함
  RESERVATION_STATUS_NOT_CONFIRMED: 93, // 확정되지 않은 예약

  // EXTERNAL : 101 ~ 120
  EXTERNAL_SERVICE_ERROR: 101, // 외부 API 호출 자체 실패
  EXTERNAL_LOCATION_LOOKUP_FAILED: 102, // 외부 API를 통한 위치 조회 실패
  EXTERNAL_PLATFORM_CONFIRM_FAILED: 103, // 토큰 예약 실패
  EXTERNAL_ICS_FETCH_FAILED: 104, // ics 텍스트 가져오기 실패

  // FILE_UPLOAD : 121 ~ 130
  FILE_UPLOAD_UNSUPPORTED_MEDIA_TYPE: 121, // 파일 업로드 타입이 다름

  // LLM : 131 ~ 140
  LLM_API_KEY_INVALID: 131, // LLM API키가 유효하지않음
  LLM_HTTP_ERROR: 132, // LLM 게이트 웨이 통신 실패

  // REDIS: 801 ~
  REDIS_INVALID_OR_EXPIRED_TOKEN: 801, // 스냅샷 유효하지 않은 토큰 or 만료된 토큰

  // DATABASE
  DB_UPDATE_FAILED: 9999, // db 업데이트 실패
} as const;

export type InternalErrorCode =
  (typeof INTERNAL_ERROR_CODE)[keyof typeof INTERNAL_ERROR_CODE];
