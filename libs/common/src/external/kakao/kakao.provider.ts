import { Injectable } from '@nestjs/common';
import { BaseHttpService } from '@libs/common/networks/base-http-service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class KakaoProvider extends BaseHttpService {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, `${process.env.KAKAO_SEARCH_URI}`);

    this.headers = { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` };
  }
}
