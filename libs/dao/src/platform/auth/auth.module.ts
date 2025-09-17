import { Module } from '@nestjs/common';
import { AuthRepository } from '@libs/dao/platform/auth/auth.repository';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';

@Module({
  imports: [
    TypeOrmExModule.forFeatures([AuthRepository], [DATABASE_NAME.AUTH]),
  ],
  exports: [TypeOrmExModule],
})
export class AuthModule {}
