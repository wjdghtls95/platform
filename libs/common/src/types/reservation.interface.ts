export type SnapshotProvider = 'naver' | 'kakao' | 'golfzone' | 'redirect';

export interface ReservationSnapshot {
  userId: number;
  golfCourseId: number;
  startAt: string;
  endAt: string;
  partySize: number;
  provider: SnapshotProvider;
}
