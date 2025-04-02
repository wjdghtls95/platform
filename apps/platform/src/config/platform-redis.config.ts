import { registerAs } from '@nestjs/config';

export default registerAs('platform-redis', () => ({
  host: process.env.REDIS_DB_HOST,
  port: Number(process.env.REDIS_DB_PORT),
  db: Number(process.env.REDIS_DB_NUMBER),
}));
