import { getTestModule } from '../utils/test.module';
import { TestingModule } from '@nestjs/testing';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from '../utils/test-transaction.utils';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';
import { UsersService } from '../../src/users/users.service';
import { TestRedisDataSourceUtils } from '../utils/test-redis-data-source.utils';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';

describe('UserService', () => {
  let module: TestingModule;

  let usersService: UsersService;

  beforeAll(async () => {
    module = await getTestModule;

    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([DATABASE_NAME.USER]);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
    await TestRedisDataSourceUtils.redisFlushDb(module);
  });

  afterAll(async () => {
    await Promise.all([
      TestDataSourceUtils.clearDataSource(module),
      TestRedisDataSourceUtils.clearRedisDataSource(module),
    ]);
  });

  it('User Service define', async () => {
    expect(usersService).toBeDefined();
  });
});
