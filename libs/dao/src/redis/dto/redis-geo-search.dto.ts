export class RedisGeoSearchDto {
  lat: number;
  lng: number;
  radius: number;
  unit: 'm' | 'km';
}
