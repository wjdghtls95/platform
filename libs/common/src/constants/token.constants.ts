export const ACCESS_TOKEN_SECRET_KEY =
  process.env.NODE_ENV + ' access token secret key';

export const REFRESH_TOKEN_SECRET_KEY =
  process.env.NODE_ENV + ' refresh token secret key';

export const ACCESS_TOKEN_TTL = 60 * 60 * 1000;

export const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_UPDATE_TTL = 7 * 24 * 60 * 60 * 1000;

// -------------------- 리다이렉트 TTL --------------------

export const REDIRECT_TOKEN_TTL_SEC = 60 * 30;

export const TOKEN_MAP_TTL_SEC = 60 * 60 * 24;

export const JWT_GUARD_EXCLUDE_PATH: string[] = [
  '/health',
  '/auth/register',
  '/auth/login',
  '/auth/google',
  '/auth/google/callback',
  '/auth/token/refresh',
];
