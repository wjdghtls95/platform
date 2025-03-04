import { PlatformServerConfigModule } from './config/platform-server-config.module';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { DefaultModule } from './default/default.module';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import platformDatabaseConfig from './config/platform-database.config';
import { UsersModule } from '@libs/dao/users/users.module';
import { AuthModule } from '@libs/dao/auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    // config
    PlatformServerConfigModule,

    // cls
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),

    // platform database (rdbms)
    TypeOrmExModule.forRootAsync({
      name: platformDatabaseConfig().name,
      inject: [platformDatabaseConfig.KEY],
      useFactory: async (config) => config,
    }),

    // health check
    DefaultModule,

    AuthModule,
    UsersModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService],
})
export class PlatformModule {}
