import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import platformDatabaseConfig from './platform-database.config';
import platformRedisConfig from './platform-redis.config';

const environment = process.env.NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.platform.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [platformDatabaseConfig, platformRedisConfig],
    }),
  ],
})
export class PlatformServerConfigModule {}
