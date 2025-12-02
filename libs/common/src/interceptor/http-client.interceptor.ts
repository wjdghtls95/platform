import { Logger } from '@nestjs/common';
import { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { randomUUID } from 'crypto';

export class HttpClientInterceptor {
  private static readonly logger = new Logger('HttpClient');

  static apply(instance: AxiosInstance) {
    instance.interceptors.request.use((config) => {
      const traceId = randomUUID();

      config.headers = (config.headers ?? {}) as AxiosRequestHeaders;

      config.headers['X-Trace-Id'] = traceId;

      this.logger.log(
        `[REQ] ${traceId} → ${config.method?.toUpperCase()} ${
          config.baseURL ?? ''
        }${config.url}`,
      );

      return config;
    });

    instance.interceptors.response.use(
      (response) => {
        const traceId = response.config.headers?.['X-Trace-Id'] ?? 'NO_TRACE';

        this.logger.log(
          `[RES] ${traceId} ← ${response.status} ${response.config.url}`,
        );

        return response;
      },
      (error) => {
        const traceId = error.config?.headers?.['X-Trace-Id'] ?? 'NO_TRACE';

        this.logger.error(`[ERR] ${traceId} ← ${error.message}`, error.stack);

        return Promise.reject(error);
      },
    );
  }
}
