import { Injectable } from '@nestjs/common';
import { AbstractHttpService } from '@libs/common/networks/abstract-http-service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class KakaoProvider extends AbstractHttpService {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, `${process.env.KAKAO_SEARCH_URI}`);

    this.headers = { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` };
  }
}
