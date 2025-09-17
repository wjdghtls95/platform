import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { UsersRepository } from '@libs/dao/platform/user/users.repository';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';

@Module({
  imports: [
    TypeOrmExModule.forFeatures([UsersRepository], [DATABASE_NAME.USER]),
  ],
  exports: [TypeOrmExModule],
})
export class UsersModule {}
