import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import smtpEmailConfig from './smtp-email.config';
import platformHttpConfig from './platform-http.config';

const environment = process.env.NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.integration.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [platformHttpConfig, smtpEmailConfig], // config 설정 등록
    }),
  ],
})
export class IntegrationServerConfigModule {}
