import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { Users } from '@libs/dao/users/users.entity';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';

@EntityRepository(Users)
export class UsersRepository extends AbstractRepository<Users> {}
