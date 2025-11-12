import { PlatformServerConfigModule } from './config/platform-server-config.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { DefaultModule } from './default/default.module';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import platformDatabaseConfig from './config/platform-database.config';
import { UsersModule } from '@libs/dao/platform/user/users.module';
import { AuthModule } from '@libs/dao/platform/auth/auth.module';
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
import { GolfCourseModule } from '@libs/dao/platform/golf-course/golf-course.module';
import { GolfCourseController } from './golf-course/golf-course.controller';
import { GolfCourseService } from './golf-course/golf-course.service';
import { KakaoModule } from '@libs/common/external/kakao/kakao.module';
import { IpLocationModule } from '@libs/common/external/ip/ip-location.module';
import { FavoriteService } from './favorite/favorite.service';
import { FavoriteModule } from '@libs/dao/platform/favorite/favorite.module';
import { FavoriteController } from './favorite/favorite.controller';
import { RedisRepositoryModule } from '@libs/dao/platform/redis/redis-repository.module';
import { CacheSyncProvider } from '@libs/common/provider/cache-sync/cache-sync.provider';
import { SwingAnalysisController } from './swing-analysis/swing-analysis.controller';
import { SwingAnalysisModule } from '@libs/dao/platform/swing-analysis/swing-analysis.module';
import { SwingAnalysisService } from './swing-analysis/swing-analysis.service';
import { ReservationModule } from '@libs/dao/platform/reservation/reservation.module';
import { ReservationController } from './reservation/reservation.controller';
import { ReservationService } from './reservation/reservation.service';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { CalendarProvider } from '@libs/common/provider/calendar/calendar.provider';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

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

    // TODO.. HTTP module custom 으로 변경고려 -> 여러 군데에서 통신을 하면 필요할듯
    // LLM 게이트웨이 전용 HttpModule 설정
    HttpModule.registerAsync({
      imports: [ConfigModule], // ConfigModule 사용
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('SWING_ANALYZER_URL'), // 기본 URL 설정 (http://localhost:3030)
        headers: {
          // 모든 요청에 API 키 자동 주입
          'X-Internal-Api-Key': configService.get<string>(
            'LLM_GATEWAY_API_KEY',
          ),
        },
        timeout: 10000, // LLM 응답을 위해 타임아웃을 10초로 넉넉하게 설정
      }),
      inject: [ConfigService], // ConfigService 주입
    }),

    // Platform Redis Register
    RedisRepositoryModule,

    // health check
    DefaultModule,

    // security
    SecurityModule,

    // external
    KakaoModule,
    IpLocationModule,

    // domain
    AuthModule,
    UsersModule,
    GolfCourseModule,
    FavoriteModule,
    SwingAnalysisModule,
    ReservationModule,
  ],
  controllers: [
    // domain
    AuthController,
    UsersController,
    GolfCourseController,
    FavoriteController,
    SwingAnalysisController,
    ReservationController,
    CalendarController,
  ],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },

    // oauth
    OAuthGoogleService,
    OAuth2Client,

    // service
    AuthService,
    UsersService,
    GolfCourseService,
    FavoriteService,
    SwingAnalysisService,
    ReservationService,
    CalendarService,

    // provider
    CacheSyncProvider,
    CalendarProvider,
  ],
})
export class PlatformModule {}
