import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from './base-database.config';
import { Auth } from '@libs/dao/auth/auth.entity';
import { User } from '@libs/dao/user/users.entity';
import { GolfCourse } from '@libs/dao/golf-course/golf-course.entity';
import { Favorite } from '@libs/dao/favorite/favorite.entity';

export default registerAs('platform-database', () => ({
  ...baseDatabaseConfig,

  type: process.env.PLATFORM_DB_TYPE ?? 'mysql',
  host: process.env.PLATFORM_DB_HOST,
  port: Number(process.env.PLATFORM_DB_PORT),
  username: process.env.PLATFORM_DB_USER,
  password: process.env.PLATFORM_DB_PASSWORD,
  name: process.env.PLATFORM_DB_NAME,
  database: process.env.PLATFORM_DB_DATABASE,
  synchronize: true,

  entities: [Auth, User, GolfCourse, Favorite],
}));
