import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants.';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

export class PlatformServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * 서버 초기화
   */
  init(): void {
    // swagger 초기화
    this._initializePlatformSwagger();

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
    Logger.log('Platform Server is running on port ' + process.env.SERVER_PORT);
    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }

  /**
   * OPEN API(Swagger) 초기화 - PlatformServer
   */
  private _initializePlatformSwagger(): void {
    if (!['prod', 'staging'].includes(process.env.NODE_ENV)) {
      const config = new DocumentBuilder()
        .setTitle('Golf Platform Project')
        .setDescription('The Golf Platform Project description')
        .setVersion('1.0')
        .addBearerAuth(
          {
            type: 'apiKey',
            name: 'authToken', // Swagger UI가 이 이름으로 인식함
            in: 'header',
            description: 'Enter the access-token you received.',
          },
          'authToken',
        )
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
