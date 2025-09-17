export const DATABASE_NAME = {
  AUTH: process.env.AUTH_DB_NAME,
  USER: process.env.USER_DB_NAME,
  GOLF_COURSE: process.env.GOLF_COURSE_DB_NAME,
  FAVORITE: process.env.FAVORITE_DB_NAME,
  SWING_ANALYSIS: process.env.SWING_ANALYSIS_DB_NAME,
  RESERVATION: process.env.RESERVATION_DB_NAME,
} as const;

export type DATABASE_NAME = (typeof DATABASE_NAME)[keyof typeof DATABASE_NAME];
