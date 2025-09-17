const PREFIX = `${process.env.APP_NAME ?? 'gp'}:${
  process.env.NODE_ENV ?? 'dev'
}`;

export const REDIS_KEY = {
  // 유저 즐겨찾기 redis 키
  userFavorites: (userId: number, golfCourseId: number) =>
    `user:${userId}:favorites:golf:${golfCourseId}`,

  // 유저 반경내 즐겨찾기 redis 키
  userGeo: (userId: number, golfCourseId: number) =>
    `geo:user:${userId}:golf:${golfCourseId}`,

  // 예약 (리다이렉트) 도메인
  // 사전예약 스냅샷(확정 전, token-only)
  resvSnapshot: (token: string) => `${PREFIX}:resv:snap:${token}`,

  // token -> reservationId 매핑(확정 후, webhook/사후 매칭용)
  resvTokenMap: (token: string) => `${PREFIX}:resv:map:${token}`,
};
