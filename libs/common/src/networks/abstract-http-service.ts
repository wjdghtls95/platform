import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';

export abstract class AbstractHttpService {
  protected baseUrl?: string;
  protected headers?: any;
  protected data?: unknown;

  protected constructor(
    protected readonly httpService: HttpService,
    protected readonly host: string,
    protected readonly port?: number,
  ) {
    this.baseUrl = this?.port ? `${this.host}:${this.port}` : `${this.host}`;
  }

  /**
   * http 조회 method
   */
  async get(options: {
    method: string;
    params?: Record<string, any>;
  }): Promise<any> {
    const url = `${this.baseUrl}/${options.method}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.headers,
          params: options?.params,
        }),
      );

      return response.data;
    } catch (e) {
      throw new ServerErrorException(e.status, e.statusText);
    }
  }

  /**
   * http 수정 method
   */
  async post(options: {
    method: string;
    data?: any;
    headers?: any; // FormData 처럼 요청마다 동적으로 생성되는 headers가 필요
  }): Promise<any> {
    const url = `${this.baseUrl}/${options.method}`;

    this.data = options.data || undefined;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, this?.data, {
          headers: options.headers || this.headers,
        }),
      );

      return typeof response.data === 'object'
        ? response.data
        : JSON.parse(response.data);
    } catch (e) {
      throw new ServerErrorException(e.status, e.statusText);
    }
  }
}
