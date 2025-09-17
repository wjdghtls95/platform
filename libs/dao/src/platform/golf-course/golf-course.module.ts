import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { GolfCourseRepository } from '@libs/dao/platform/golf-course/golf-course.repository';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [GolfCourseRepository],
      [DATABASE_NAME.GOLF_COURSE],
    ),
  ],
  exports: [TypeOrmExModule],
})
export class GolfCourseModule {}
