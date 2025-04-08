export const REDIS_KEY = {
  userFavorites: (userId: number, golfCourseId: number) =>
    `user:${userId}:favorites:golf:${golfCourseId}`,
  userGeo: (userId: number, golfCourseId: number) =>
    `geo:user:${userId}:golf:${golfCourseId}`,
};
