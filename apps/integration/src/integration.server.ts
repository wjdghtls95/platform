import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants.';
import * as compression from 'compression';

export class IntegrationServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * integration (web hook, email send) 서버 초기화
   */
  init(): void {
    this._initializeIntegrationServer();

    this.app.use(compression({ level: 6 }));
  }

  /**
   * 서버 실행
   */
  async run(): Promise<void> {
    Logger.log(
      'Integration Server is running on port: ',
      process.env.SERVER_PORT,
    );

    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }

  /**
   * OPEN API(Swagger) 초기화 - IntegrationServer
   */
  private _initializeIntegrationServer(): void {
    if (!['prod', 'staging'].includes(process.env.NODE_ENV)) {
      const config = new DocumentBuilder()
        .setTitle('Integration Server')
        .setDescription('The Integration Server description')
        .setVersion('1.0')
        .addApiKey(
          {
            type: 'apiKey',
            name: 'x-internal-api-key',
            in: 'header',
            description: 'Enter the Platform Internal API Key',
          },
          'api-key',
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
