export const DATABASE_NAME = {
  AUTH: process.env.PLATFORM_NAME,
  USER: process.env.PLATFORM_NAME,
} as const;

export type DataBaseName = (typeof DATABASE_NAME)[keyof typeof DATABASE_NAME];
