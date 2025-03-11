import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants.';

export class PlatformServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * 서버 초기화
   */
  init(): void {
    // swagger 초기화
    this._initializePlatformSwagger();
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
