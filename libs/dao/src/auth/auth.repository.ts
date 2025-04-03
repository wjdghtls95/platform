import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { Auth } from '@libs/dao/auth/auth.entity';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';

@EntityRepository(Auth)
export class AuthRepository extends AbstractRepository<Auth> {
  /**
   * 유저 아이디로 조회
   */
  async findByUserId(userId: number): Promise<Auth> {
    return this.getQueryBuilder
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .getOne();
  }

  /**
   * 이메일로 조회
   */
  async findByEmail(email: string): Promise<Auth> {
    return this.getQueryBuilder
      .where(`${this.alias}.email=:email`, { email: email })
      .getOne();
  }

  /**
   * 이메일로 다중 조회
   */
  async findByEmailIn(emails: string[]): Promise<Auth[]> {
    return this.getQueryBuilder
      .where(`${this.alias}.email IN (:...emails)`, { emails: emails })
      .getMany();
  }
}
