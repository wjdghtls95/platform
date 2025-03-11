export const AUTH_TYPE = {
  EMAIL: 0,
  GOOGLE: 1,
} as const;

export type AUTH_TYPE = (typeof AUTH_TYPE)[keyof typeof AUTH_TYPE];
