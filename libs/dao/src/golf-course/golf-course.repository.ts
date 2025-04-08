import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { GolfCourse } from '@libs/dao/golf-course/golf-course.entity';

@EntityRepository(GolfCourse)
export class GolfCourseRepository extends AbstractRepository<GolfCourse> {
  /**
   * 유저 아이디로 골프장 조회
   */
  async findByUserId(userId: number): Promise<GolfCourse> {
    return this.getQueryBuilder
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .getOne();
  }

  /**
   * 유저 아이디로 다수 골프장 조회
   */
  async findByUserIdIn(userId: number): Promise<GolfCourse[]> {
    return this.getQueryBuilder
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .getMany();
  }

  /**
   * 유저 아이디 & 좌표로 골프장 조회
   */
  async findByUserIdAndCoordinates(
    userId: number,
    courseName: string,
    lng: number,
    lat: number,
  ): Promise<GolfCourse> {
    return this.getQueryBuilder
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .andWhere(`${this.alias}.courseName=:courseName`, {
        courseName: courseName,
      })
      .andWhere(`${this.alias}.lng=:lng`, { lng: lng })
      .andWhere(`${this.alias}.lat=:lat`, { lat: lat })
      .getOne();
  }
}
