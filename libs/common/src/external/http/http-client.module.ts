import { DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import {
  HTTP_CLIENT_DEFAULTS,
  HttpClientConfig,
  HttpClientEnvConfig,
} from '@libs/common/external/http/interface/http-client.interface';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { HttpClientInterceptor } from '@libs/common/interceptor/http-client.interceptor';

/**
 * TODO.. 여기부분 ERROR 부분 전부다 수정 필수
 * 외부 서비스별 Axios + HttpService 인스턴스를 생성하고 Nest DI 컨테이너에 등록해주는 인프라 모듈
 * 각 서비스는 HttpClientEnvConfig로 설정
 */
@Global()
@Module({})
export class HttpClientModule {
  // 루트 모듈에서 한 번만 호출
  static forRoot(configs: HttpClientEnvConfig[]): DynamicModule {
    const providers: FactoryProvider[] = configs.map((config) => ({
      provide: config.name,
      useFactory: (configService: ConfigService) => {
        const resolvedConfig = this.resolveConfig(config, configService);
        const instance = this.createAxiosInstance(resolvedConfig);

        // Nest의 HttpService 래퍼로 감싸서 주입할 수 있게 함
        return new HttpService(instance);
      },
      inject: [ConfigService],
    }));

    return {
      module: HttpClientModule,
      imports: [ConfigModule, HttpModule],
      providers,
      exports: configs.map((config) => config.name), // 토큰 이름으로 export (e.g. 'SWING_ANALYZER', 'KAKAO' 등)
    };
  }

  /***
   * HttpClientEnvConfig(환경변수 기반 설정)를 HttpClientConfig(실제 값이 해석된 설정)으로 변환
   */
  private static resolveConfig(
    config: HttpClientEnvConfig,
    env: ConfigService,
  ): HttpClientConfig {
    const baseURL = env.get<string>(config.baseUrlEnv);
    if (!baseURL) {
      throw new Error(
        `[HttpClientModule] ${config.baseUrlEnv} is missing for ${config.name}`,
      );
    }

    const headers: Record<string, any> = {
      'Content-Type': config.contentType ?? HTTP_CLIENT_DEFAULTS.CONTENT_TYPE,
    };

    // API Key가 필요한 경우
    if (config.apiKeyEnv) {
      const apiKey = env.get<string>(config.apiKeyEnv);
      if (!apiKey) {
        throw new Error(
          `[HttpClientModule] ${config.apiKeyEnv} is missing for ${config.name}`,
        );
      }

      const headerName = config.apiKeyHeaderName ?? 'X-Internal-Api-Key';

      headers[headerName] = config.apiKeyPrefix
        ? `${config.apiKeyPrefix} ${apiKey}`
        : apiKey;
    }

    // 추가 헤더가 있으면 합침
    if (config.extraHeaders) {
      Object.assign(headers, config.extraHeaders);
    }

    return {
      name: config.name,
      baseURL,
      headers,
      timeout: config.timeout ?? HTTP_CLIENT_DEFAULTS.TIMEOUT,
      maxRedirects: config.maxRedirects ?? HTTP_CLIENT_DEFAULTS.MAX_REDIRECTS,
    };
  }

  /**
   * HttpClientConfig 를 바탕으로 axios 인스턴스를 생성
   */
  private static createAxiosInstance(
    resolved: HttpClientConfig,
  ): AxiosInstance {
    const instance = axios.create({
      baseURL: resolved.baseURL,
      headers: resolved.headers,
      timeout: resolved.timeout,
      maxRedirects: resolved.maxRedirects,
    });

    // 공통 인터셉터 적용
    HttpClientInterceptor.apply(instance);

    return instance;
  }
}
