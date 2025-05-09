export class RedisAddFavoriteDto {
  placeId: number; // Open API 장소 ID
  name: string; // 장소 이름
  category: string; // 예: 맛집, 주유소, 편의점
  lat: string; // 위도
  lng: string; // 경도
}
