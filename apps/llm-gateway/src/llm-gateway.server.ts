import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants.';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

export class LLMGatewayServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * 서버 초기화
   */
  init(): void {
    // swagger 초기화
    this._initializeLLMGatewayServerSwagger();

    this.app.use(cookieParser());

    // cors
    this.app.enableCors({
      origin: '*', // 또는 특정 origin: 'http://localhost:3000'
      credentials: true, // 쿠키 사용할 경우 필수
    });

    this.app.use(compression({ level: 6 }));
  }

  /**
   * 서버 실행
   */
  async run(): Promise<void> {
    const port = process.env.LLM_GATEWAY_SERVER_PORT;

    Logger.log('LLM Gateway Server is running on port: ' + port);

    await this.app.listen(port, '0.0.0.0');
  }

  /**
   * OPEN API(Swagger) 초기화 - LLMGatewayServer
   */
  private _initializeLLMGatewayServerSwagger(): void {
    if (!['prod', 'staging'].includes(process.env.NODE_ENV)) {
      const config = new DocumentBuilder()
        .setTitle('LLM Gateway Api')
        .setDescription(
          '전용 LLM 통합 게이트웨이\n\n' +
            '**인증 방법**: X-Internal-API-Key 헤더에 API 키를 포함하세요.',
        )
        .setVersion('1.0')
        .addApiKey(
          {
            type: 'apiKey',
            name: 'X-Internal-Api-Key', // Swagger UI가 이 이름으로 인식함
            in: 'header',
            description: '내부 서비스 인증용 API 키를 입력하세요.',
          },
          'api-key-auth',
        ) // TODO.. add Bearer Auth 나중에 추가
        .build();
      const document = SwaggerModule.createDocument(this.app, config);

      SwaggerModule.setup(
        '/api-docs',
        this.app,
        document,
        SWAGGER_CUSTOM_OPTIONS,
      );
    }
  }
}
