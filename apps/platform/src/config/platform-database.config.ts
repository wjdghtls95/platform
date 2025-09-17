import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from './base-database.config';
import { Auth } from '@libs/dao/platform/auth/auth.entity';
import { User } from '@libs/dao/platform/user/users.entity';
import { GolfCourse } from '@libs/dao/platform/golf-course/golf-course.entity';
import { Favorite } from '@libs/dao/platform/favorite/favorite.entity';
import { SwingAnalysis } from '@libs/dao/platform/swing-analysis/swing-analysis.entity';
import { Reservation } from '@libs/dao/platform/reservation/reservation.entity';
import { ReservationExternal } from '@libs/dao/platform/reservation/external/reservation-external.entity';
import { ReservationEvent } from '@libs/dao/platform/reservation/event/reservation-event.entity';

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

  entities: [
    Auth,
    User,
    GolfCourse,
    Favorite,
    SwingAnalysis,
    Reservation,
    ReservationExternal,
    ReservationEvent,
  ],
}));
