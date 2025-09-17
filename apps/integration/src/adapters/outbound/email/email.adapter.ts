import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_CLIENT, EmailClient } from './email-client.provider';
import { IEmailSender } from '@libs/common/ports/outbound/email-sender.port';

@Injectable()
export class EmailAdapter implements IEmailSender {
  constructor(
    @Inject(EMAIL_CLIENT)
    private readonly emailClient: EmailClient,
  ) {}

  async sendIcs(
    to: string,
    subject: string,
    icsText: string,
  ): Promise<{ messageId: string; previewUrl?: string }> {
    const info = await this.emailClient.transport.sendMail({
      from: this.emailClient.from,
      to,
      subject,
      text: 'Your reservation has been confirmed. See attached calendar file.',
      // nodemailer의 ICS 첨부 방법
      icalEvent: { method: 'PUBLISH', content: icsText },
    });

    // Ethereal 사용시 미리보기 URL이 들어올 수 있음
    const previewUrl = (info as any).previewUrl;

    return { messageId: info.messageId, previewUrl };
  }

  async sendText(
    to: string,
    subject: string,
    text: string,
  ): Promise<{ messageId: string; previewUrl?: string }> {
    const info = await this.emailClient.transport.sendMail({
      from: this.emailClient.from,
      to,
      subject,
      text,
    });

    const previewUrl = (info as any).previewUrl;

    return { messageId: info.messageId, previewUrl };
  }
}
