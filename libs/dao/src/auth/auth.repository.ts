import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { Auth } from '@libs/dao/auth/auth.entity';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';

@EntityRepository(Auth)
export class AuthRepository extends AbstractRepository<Auth> {
  async findByUserId(userId: number): Promise<Auth> {
    return this.getQueryBuilder
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .getOne();
  }
}
