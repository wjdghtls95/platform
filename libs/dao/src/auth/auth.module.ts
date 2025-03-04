import { Module } from '@nestjs/common';
import { AuthRepository } from '@libs/dao/auth/auth.repository';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [AuthRepository],
      [process.env.PLATFORM_DB_NAME],
    ),
  ],
  exports: [TypeOrmExModule],
})
export class AuthModule {}
