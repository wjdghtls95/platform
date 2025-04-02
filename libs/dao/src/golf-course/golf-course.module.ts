import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { golfCourseRepository } from '@libs/dao/golf-course/golf-course.repository';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [golfCourseRepository],
      [DATABASE_NAME.GOLF_COURSE],
    ),
  ],
  exports: [TypeOrmExModule],
})
export class GolfCourseModule {}
