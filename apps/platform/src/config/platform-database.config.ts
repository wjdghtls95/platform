import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from './base-database.config';
import { Users } from '@libs/dao/users/users.entity';
import { Auth } from '@libs/dao/auth/auth.entity';

export default registerAs('platform-database', () => ({
  ...baseDatabaseConfig,

  type: process.env.PLATFORM_DB_TYPE,
  host: process.env.PLATFORM_DB_HOST,
  port: Number(process.env.PLATFORM_DB_PORT),
  username: process.env.PLATFORM_DB_USER,
  password: process.env.PLATFORM_DB_PASSWORD,
  name: process.env.PLATFORM_DB_NAME,
  database: process.env.PLATFORM_DB_DATABASE,
  synchronize: true,
  entities: [Auth, Users],
  // entities: ['dist/libs/dao/src/**/**/*.entity.!(js.map){,+(ts,js)}'],
}));
