import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { UsersRepository } from '@libs/dao/users/users.repository';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [UsersRepository],
      [process.env.PLATFORM_DB_NAME],
    ),
  ],
  exports: [TypeOrmExModule],
})
export class UsersModule {}
