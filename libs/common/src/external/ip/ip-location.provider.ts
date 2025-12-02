import { Inject, Injectable } from '@nestjs/common';
import { AbstractHttpService } from '@libs/common/networks/abstract-http-service';
import { HttpService } from '@nestjs/axios';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { HTTP_CLIENT_TOKENS } from '@libs/common/constants/http-client.constants';

@Injectable()
export class IpLocationProvider extends AbstractHttpService {
  constructor(
    @Inject(HTTP_CLIENT_TOKENS.IP_LOCATION)
    protected readonly ipLocationHttp: HttpService,
  ) {
    super(ipLocationHttp, ``);
  }

  /**
   * ip로 위치(위도, 경도) 조회
   */
  async getLocation(ip: string): Promise<{ lat: string; lng: string }> {
    try {
      const response = await this.get({
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
