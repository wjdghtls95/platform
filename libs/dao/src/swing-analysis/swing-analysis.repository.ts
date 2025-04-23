import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { GolfCourse } from '@libs/dao/golf-course/golf-course.entity';
import { SwingAnalysis } from '@libs/dao/swing-analysis/swing-analysis.entity';

@EntityRepository(SwingAnalysis)
export class SwingAnalysisRepository extends AbstractRepository<SwingAnalysis> {
  /**
   * 유저 아이디로 스윙 분석 조회
   */
  async findByUserId(userId: number): Promise<SwingAnalysis> {
    return this.getQueryBuilder
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .getOne();
  }
}
