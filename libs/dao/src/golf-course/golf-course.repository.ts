import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { GolfCourse } from '@libs/dao/golf-course/golf-course.entity';

@EntityRepository(GolfCourse)
export class GolfCourseRepository extends AbstractRepository<GolfCourse> {}

export class golfCourseRepository {}
