import { getTestModule } from '../utils/test.module';
import { TestingModule } from '@nestjs/testing';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from '../utils/test-transaction.utils';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';

describe('Template', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await getTestModule;
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([process.env.PLATFORM_DB_NAME]);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
  });

  afterAll(async () => {
    await Promise.all([
      TestDataSourceUtils.clearDataSource(module),
      module.close(),
    ]);
  });

  it('Auth Service define', async () => {
    /**
     *
     */
  });
});
