import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Provider } from '@nestjs/common';
import smtpEmailConfig from '../../../config/smtp-email.config';
import { ConfigType } from '@nestjs/config';

export const EMAIL_CLIENT = Symbol.for('EMAIL_CLIENT');

export interface EmailClient {
  transport: Transporter;
  from: string;
}

export const EmailClientProvider: Provider = {
  provide: EMAIL_CLIENT,
  inject: [smtpEmailConfig.KEY],
  useFactory: (configType: ConfigType<typeof smtpEmailConfig>): EmailClient => {
    const transport = nodemailer.createTransport({
      host: configType.host,
      port: configType.port,
      secure: configType.secure,
      auth: configType.user
        ? { user: configType.user, pass: configType.pass }
        : undefined,
    });

    return {
      transport,
      from: configType.from,
    };
  },
};
