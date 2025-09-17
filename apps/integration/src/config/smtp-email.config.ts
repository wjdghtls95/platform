import { registerAs } from '@nestjs/config';

export default registerAs('smtp-email', () => ({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true', // 보통 465는 true
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.MAIL_FROM || '"Golf Platform" <no-reply@golf.local>',
}));
