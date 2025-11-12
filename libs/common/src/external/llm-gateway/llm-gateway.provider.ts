// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { ConfigService } from '@nestjs/config';
// import { firstValueFrom } from 'rxjs';
// import { AbstractHttpService } from '../../networks/abstract-http-service';
// import { SwingAnalysisOutDto } from '@libs/dao/platform/swing-analysis/dto/swing-analysis-out.dto';
// import FormData from 'form-data';
// import { ServerErrorException } from '@libs/common/exception/server-error.exception';
// import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
//
// @Injectable()
// export class SwingAnalysisProvider extends AbstractHttpService {
//   private readonly timeout: number;
//
//   constructor(
//     protected readonly httpService: HttpService,
//     protected readonly configService: ConfigService,
//   ) {
//     super(httpService, configService.get<string>('SWING_ANALYZER_URL'));
//     this.timeout = this.configService.get<number>(
//       'SWING_ANALYZER_TIMEOUT',
//       180000,
//     );
//   }
//
//   async postSwingAnalysis(formData: FormData): Promise<SwingAnalysisOutDto> {
//     try {
//       const response = await firstValueFrom(
//         this.httpService.post(
//           `${this.baseUrl}/swing-analysis/direct`,
//           formData,
//           {
//             headers: {
//               ...formData.getHeaders(),
//             },
//             timeout: this.timeout,
//           },
//         ),
//       );
//       return response.data;
//     } catch (error) {
//       throw new ServerErrorException(INTERNAL_ERROR_CODE.LLM_HTTP_ERROR);
//     }
//   }
// }
