import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { Users } from '@libs/dao/users/users.entity';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';

@EntityRepository(Users)
export class UsersRepository extends AbstractRepository<Users> {
  async findByEmail(email: string): Promise<Users> {
    return this.getQueryBuilder
      .where(`${this.alias}.email=:email`, { email: email })
      .getOne();
  }

  async findByEmailIn(emails: string[]): Promise<Users[]> {
    return this.getQueryBuilder
      .where(`${this.alias}.email IN (:...emails)`, { emails: emails })
      .getMany();
  }
}
