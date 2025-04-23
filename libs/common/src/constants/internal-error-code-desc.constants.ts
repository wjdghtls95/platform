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

  // API_SECURITY
  [e.API_SECURITY_AUTH_TOKEN_INVALIDATE]: 'authToken 유효 하지 않음',

  // GOLF COURSE
  [e.GOLF_COURSE_NOT_FOUND]: '리스트에 등록되지 않은 골프장',
  [e.GOLF_COURSE_ALREADY_CREATED]: '리스트에 이미 등록된 골프장',

  // FAVORITE PLACE
  [e.FAVORITE_PLACE_ALREADY_EXISTED]: '즐겨찾기에 이미 존재',
  [e.FAVORITE_PLACE_SAVE_FAILED]: '즐겨찾기 저장 실패',
  [e.FAVORITE_PLACE_DELETE_FAILED]: '즐겨찾기 삭제 실패',

  // EXTERNAL
  [e.EXTERNAL_SERVICE_ERROR]: '외부 API 호출 실패',
  [e.EXTERNAL_LOCATION_LOOKUP_FAILED]: '외부 API를 통한 위치 조회 실패',

  // FILE_UPLOAD : 121 ~ 130
  [e.FILE_UPLOAD_UNSUPPORTED_MEDIA_TYPE]: '파일 업로드 타입이 다름',

  // DATABASE
  [e.DB_UPDATE_FAILED]: 'db 얻데이트 실패',
} as const;
