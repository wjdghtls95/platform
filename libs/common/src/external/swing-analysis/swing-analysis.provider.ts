import { Injectable } from '@nestjs/common';
import { AbstractHttpService } from '@libs/common/networks/abstract-http-service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SwingAnalysisProvider extends AbstractHttpService {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, `${process.env.SWING_ANALYSIS_URL}`);
  }
}
