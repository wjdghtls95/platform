export interface IEmailSender {
  sendIcs(
    to: string,
    subject: string,
    icsText: string,
  ): Promise<{ messageId: string; previewUrl?: string }>;

  sendText(
    to: string,
    subject: string,
    text: string,
  ): Promise<{ messageId: string; previewUrl?: string }>;
}

export const EMAIL_SENDER = Symbol('EMAIL_SENDER');
