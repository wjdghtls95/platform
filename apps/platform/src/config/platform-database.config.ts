import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from './base-database.config';

export default registerAs('platform-database', () => ({
  ...baseDatabaseConfig,

  type: process.env.DB_TYPE ?? 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  database: process.env.DB_DATABASE,

  synchronize: process.env.NODE_ENV === 'test' ? true : false,

  entities: [
    `${process.cwd()}/{dist/,}libs/dao/src/platform/**/*.entity.{ts,js}`,
  ],
}));
