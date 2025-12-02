export interface KakaoSearchKeywordParams {
  keyword: string;
  page?: number;
  size?: number;
}

export interface KakaoSearchNearbyParams {
  categoryGroupCode: string;
  lng: string;
  lat: string;
  radius: number;
  page?: number;
  size?: number;
}
