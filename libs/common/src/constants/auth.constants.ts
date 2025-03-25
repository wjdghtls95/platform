export const AUTH_TYPE = {
  EMAIL: 'email',
  GOOGLE: 'google',
} as const;

export type AuthType = (typeof AUTH_TYPE)[keyof typeof AUTH_TYPE];
