import { Injectable } from '@nestjs/common';
import { AbstractHttpService } from '@libs/common/networks/abstract-http-service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SwingAnalysisProvider extends AbstractHttpService {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, `${process.env.LLM_GATEWAY_URL}`);

    this.headers = this.headers = {
      'x-internal-api-key': `${process.env.LLM_GATEWAY_API_KEY}`,
    };
  }
}
