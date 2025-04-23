import { Injectable } from '@nestjs/common';
import { AbstractHttpService } from '@libs/common/networks/abstract-http-service';
import { HttpService } from '@nestjs/axios';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class IpLocationProvider extends AbstractHttpService {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, `${process.env.SEARCH_IP_URI}`);
  }

  /**
   * ip로 위치(위도, 경도) 조회
   */
  async getLocation(ip: string): Promise<{ lat: string; lng: string }> {
    try {
      const response = await super.get({
        method: `${ip}/json`,
      });

      if (!response.latitude || !response.longitude) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.EXTERNAL_LOCATION_LOOKUP_FAILED,
        );
      }
      return {
        lat: response.latitude,
        lng: response.longitude,
      };
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.EXTERNAL_SERVICE_ERROR,
      );
    }
  }
}
