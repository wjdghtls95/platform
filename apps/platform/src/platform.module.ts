import { PlatformServerConfigModule } from './config/platform-server-config.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { DefaultModule } from './default/default.module';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import platformDatabaseConfig from './config/platform-database.config';
import { UsersModule } from '@libs/dao/user/users.module';
import { AuthModule } from '@libs/dao/auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { TransactionInterceptor } from '@libs/common/interceptor/transaction.interceptor';
import { SecurityModule } from '@libs/common/security/security.module';
import { OAuthGoogleService } from './auth/google/oauth-google.service';
import { OAuth2Client } from 'google-auth-library';
import { GolfCourseModule } from '@libs/dao/golf-course/golf-course.module';
import { GolfCourseController } from './golf-course/golf-course.controller';
import { GolfCourseService } from './golf-course/golf-course.service';
import { KakaoModule } from '@libs/common/external/kakao/kakao.module';

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

    // security
    SecurityModule,

    // external
    KakaoModule,

    // domain
    AuthModule,
    UsersModule,
    GolfCourseModule,
  ],
  controllers: [AuthController, UsersController, GolfCourseController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
    // { provide: APP_GUARD, useClass: JwtGuard },

    // oauth
    OAuthGoogleService,
    OAuth2Client,

    // service
    AuthService,
    UsersService,
    GolfCourseService,
  ],
})
export class PlatformModule {}
