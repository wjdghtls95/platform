import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { User } from '@libs/dao/platform/user/users.entity';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';

@EntityRepository(User)
export class UsersRepository extends AbstractRepository<User> {}
