export const REDIS_KEY = {
  // 유저 즐겨찾기 redis 키
  userFavorites: (userId: number, golfCourseId: number) =>
    `user:${userId}:favorites:golf:${golfCourseId}`,

  // 유저 반경내 즐겨찾기 redis 키
  userGeo: (userId: number, golfCourseId: number) =>
    `geo:user:${userId}:golf:${golfCourseId}`,
};
