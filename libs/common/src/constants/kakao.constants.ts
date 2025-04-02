export const KAKAO_CATEGORY_CODE = {
  MARKET: 'MT1', // 대형 마트
  CONVENIENCE_STORE: 'CS2', // 편의점
  GOLF_COURSE: 'CT1', // 골프장
  GAS_STATION: 'OL7', // 주유소
  RESTAURANT: 'FD6', // 음식점
  SPORTS_GOODS: 'AD5', // 스포츠용품점
  BANK: 'BK9', // 은행
  CAFE: 'CE7', // 카페
  HOSPITAL: 'HP8', // 병원
} as const;

export type KakaoCategoryCode =
  (typeof KAKAO_CATEGORY_CODE)[keyof typeof KAKAO_CATEGORY_CODE];
