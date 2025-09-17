import { AbstractHttpService } from '@libs/common/networks/abstract-http-service';
import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import platformHttpConfig from '../config/platform-http.config';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class PlatformHttpClient extends AbstractHttpService {
  constructor(
    protected readonly httpService: HttpService,
    @Inject(platformHttpConfig.KEY)
    config: ConfigType<typeof platformHttpConfig>,
  ) {
    super(httpService, config.baseUrl);
    this.headers = config.internalApiKey
      ? { 'x-internal-api-key': config.internalApiKey }
      : {};
  }

  /**
   * 예약 확정
   */
  async confirmReservationByToken(
    token: string,
  ): Promise<{ reservationId: number; status: string }> {
    try {
      return await this.post({
        method: 'reservation/confirm',
        data: { token },
      });
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.EXTERNAL_PLATFORM_CONFIRM_FAILED,
      );
    }
  }

  /**
   * ICS 텍스트 가져오기
   * platform이 string 혹은 { ics: string }로 응답할 수 있어 둘 다 대응
   */
  async fetchIcsText(reservationId: number): Promise<string> {
    try {
      const data = await this.get({
        method: 'calendar/ics',
        params: { reservationId },
      });
      return typeof data === 'string' ? data : data?.ics ?? '';
    } catch {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.EXTERNAL_SERVICE_ERROR,
        'platform ics fetch failed',
      );
    }
  }
}
