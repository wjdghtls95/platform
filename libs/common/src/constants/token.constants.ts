export const ACCESS_TOKEN_SECRET_KEY =
  process.env.NODE_ENV + ' access token secret key';

export const REFRESH_TOKEN_SECRET_KEY =
  process.env.NODE_ENV + ' refresh token secret key';

export const ACCESS_TOKEN_TTL = 60 * 60 * 1000;

export const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_UPDATE_TTL = 7 * 24 * 60 * 60 * 1000;

export const JWT_GUARD_EXCLUDE_PATH: string[] = [
  '/health',
  '/auth/register',
  '/auth/login',
  '/auth/google',
  '/auth/google/callback',
  '/auth/token/refresh',
];
