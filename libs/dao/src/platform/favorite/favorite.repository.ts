import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { Favorite } from '@libs/dao/platform/favorite/favorite.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@EntityRepository(Favorite)
export class FavoriteRepository extends AbstractRepository<Favorite> {
  /**
   * 유저 아이디로 조회
   */
  async findManyByUserId(userId: number): Promise<Favorite[]> {
    return await this.getQueryBuilder
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .getMany();
  }

  /**
   * 유저 아이디, 골프장 아이디, 장소 아이디로 삭제
   */
  async deleteByUserIdAndPlace(
    userId: number,
    golfCourseId: number,
    placeId: number,
  ): Promise<DeleteResult> {
    return await this.getQueryBuilder
      .delete()
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .andWhere(`${this.alias}.golfCourseId=:golfCourseId`, {
        golfCourseId: golfCourseId,
      })
      .andWhere(`${this.alias}.placeId=:placeId`, { placeId: placeId })
      .execute();
  }
}
