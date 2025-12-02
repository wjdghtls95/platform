import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';

export abstract class AbstractHttpService {
  protected constructor(
    protected readonly httpService: HttpService,
    protected readonly basePath: string = '',
  ) {}

  /**
   * Http Get method
   */
  async get<T = any>(options: {
    method: string;
    params?: Record<string, any>;
    headers?: Record<string, any>;
  }): Promise<T> {
    const url = this.buildUrl(options.method);

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: options.headers,
          params: options?.params,
        }),
      );

      return response.data as T;
    } catch (e) {
      throw new ServerErrorException(e.status, e.statusText);
    }
  }

  /**
   * Http Post method
   */
  async post<T = any>(options: {
    method: string;
    data?: any;
    headers?: any; // FormData 처럼 요청마다 동적으로 생성되는 headers가 필요
  }): Promise<T> {
    const url = this.buildUrl(options.method);

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, options.data, {
          headers: options.headers,
        }),
      );

      return typeof response.data === 'object'
        ? (response.data as T)
        : (JSON.parse(response.data) as T);
    } catch (e) {
      throw new ServerErrorException(e.status, e.statusText);
    }
  }

  /**
   * basePath + method를 합쳐 최종 URL path를 만듦
   */
  protected buildUrl(method: string): string {
    if (!this.basePath) return method.replace(/^\//, '');
    return `${this.basePath.replace(/\/$/, '')}/${method.replace(/^\//, '')}`;
  }
}
