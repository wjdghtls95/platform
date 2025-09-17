import { Injectable } from '@nestjs/common';
import { IpLocationProvider } from '@libs/common/external/ip/ip-location.provider';
import { UserLocationOutDto } from '@libs/dao/platform/user/dto/user-location-out.dto';

@Injectable()
export class UsersService {
  constructor(private readonly ipLocationProvider: IpLocationProvider) {}

  /**
   * ip 로 유저 현재위치 조회
   */
  async getUserLocationByIp(
    req: Request,
    realIp: string,
  ): Promise<UserLocationOutDto> {
    const ip = this._extractClientIp(req);

    const usedIp = ip ?? realIp;

    const location = await this.ipLocationProvider.getLocation(usedIp);

    return UserLocationOutDto.of({
      lat: location.lat,
      lng: location.lng,
    });
  }

  /**
   * header 에서 ip 추출
   */
  private _extractClientIp(req: Request): string {
    const ip = req.headers['x-forwarded-for'];

    return Array.isArray(ip) ? ip[0] : ip?.toString() ?? '';
  }
}
