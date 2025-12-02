import { Inject, Injectable, Logger } from '@nestjs/common';
import { AbstractHttpService } from '@libs/common/networks/abstract-http-service';
import { HttpService } from '@nestjs/axios';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { HTTP_CLIENT_TOKENS } from '@libs/common/constants/http-client.constants';
import {
  KakaoSearchKeywordParams,
  KakaoSearchNearbyParams,
} from '@libs/common/external/kakao/kakao.types';

@Injectable()
export class KakaoProvider extends AbstractHttpService {
  private readonly logger = new Logger(KakaoProvider.name);

  constructor(
    @Inject(HTTP_CLIENT_TOKENS.KAKAO) protected readonly kakaoHttp: HttpService,
  ) {
    super(kakaoHttp, `/v2/local/search`);
  }

  async searchByKeyword(params: KakaoSearchKeywordParams): Promise<any> {
    const { keyword, page, size } = params;

    try {
      const data = await this.get<any>({
        method: 'keyword.json',
        params: {
          query: keyword,
          page,
          size,
        },
      });
      return data;
    } catch (error: any) {
      this.logger.error(
        `Kakao searchByKeyword error: ${error.message}`,
        error.stack,
      );
      throw new ServerErrorException(INTERNAL_ERROR_CODE.LLM_HTTP_ERROR);
    }
  }

  async searchNearby(params: KakaoSearchNearbyParams): Promise<any> {
    const { categoryGroupCode, lng, lat, radius, page, size } = params;

    try {
      const data = await this.get<any>({
        method: 'category.json',
        params: {
          category_group_code: categoryGroupCode,
          x: lng,
          y: lat,
          radius,
          page,
          size,
        },
      });
      return data;
    } catch (error: any) {
      this.logger.error(
        `Kakao searchNearby error: ${error.message}`,
        error.stack,
      );
      throw new ServerErrorException(INTERNAL_ERROR_CODE.LLM_HTTP_ERROR);
    }
  }
}
