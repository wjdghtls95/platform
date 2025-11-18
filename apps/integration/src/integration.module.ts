import { Module } from '@nestjs/common';
import { IntegrationServerConfigModule } from './config/integration-server.config.module';
import { ConfigModule } from '@nestjs/config';
import smtpEmailConfig from './config/smtp-email.config';
import { EMAIL_SENDER } from '@libs/common/ports/outbound/email-sender.port';
import { EmailAdapter } from './adapters/outbound/email/email.adapter';
import { EmailClientProvider } from './adapters/outbound/email/email-client.provider';
import { HttpModule } from '@nestjs/axios';
import { DefaultModule } from './default/default.module';
import { ReservationEmailController } from './reservation-email/reservation-email.controller';
import { ReservationEmailService } from './reservation-email/reservation-email.service';
import { PlatformHttpClient } from './client/platform-http.client';
import { IntegrationSecurityModule } from '@libs/common/security/modules/integration-security.module';

@Module({
  imports: [
    // config
    IntegrationServerConfigModule,

    ConfigModule.forFeature(smtpEmailConfig),

    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),

    // health check
    DefaultModule,

    IntegrationSecurityModule,
  ],
  controllers: [ReservationEmailController],
  providers: [
    // TODO.. client를 좀 숨길 방법을 찾아야될듯
    PlatformHttpClient,

    // port 바운딩
    { provide: EMAIL_SENDER, useClass: EmailAdapter },

    // 이메일 클라이언트 인스턴스
    EmailClientProvider,

    // Domain
    ReservationEmailService,
  ],
})
export class IntegrationModule {}
