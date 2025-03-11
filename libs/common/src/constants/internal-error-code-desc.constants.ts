import { INTERNAL_ERROR_CODE as e } from './internal-error-code.constants';

export const INTERNAL_ERROR_CODE_DESC = {
  // AUTH
  [e.AUTH_PASSWORD_NOT_FOUND]: '이메일 가입시 비밀번호를 찾을 수 없음',
  [e.AUTH_PROVIDER_ID_NOT_FOUND]: 'OAuth 가입시 id를 찾을 수 없음',

  // USER
  [e.USER_NOT_FOUND]: '유저 정보를 찾을 수 없음',
  [e.USER_ALREADY_CREATED]: '이미 생성 된 유저',

  // DATABASE
  [e.DB_UPDATE_FAILED]: 'db 얻데이트 실패',
} as const;
