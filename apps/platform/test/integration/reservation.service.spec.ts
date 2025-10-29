import { getTestModule } from '../utils/test.module';
import { TestingModule } from '@nestjs/testing';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from '../utils/test-transaction.utils';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';
import { TestRedisDataSourceUtils } from '../utils/test-redis-data-source.utils';
import { ReservationService } from '../../src/reservation/reservation.service';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { User } from '@libs/dao/platform/user/users.entity';

describe('Reservation Service', () => {
  let module: TestingModule;

  // variable
  // let user: User;
  // let userId: number;

  beforeAll(async () => {
    module = await getTestModule;

    const reservationService =
      module.get<ReservationService>(ReservationService);
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([
      DATABASE_NAME.FAVORITE,
      DATABASE_NAME.GOLF_COURSE,
      DATABASE_NAME.USER,
      DATABASE_NAME.RESERVATION,
    ]);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
    await TestRedisDataSourceUtils.redisFlushDb(module);
  });

  afterAll(async () => {
    await Promise.all([
      TestDataSourceUtils.clearDataSource(module),
      TestRedisDataSourceUtils.clearRedisDataSource(module),

      module.close(),
    ]);
  });

  it('Reservation Service define', async () => {
    expect(ReservationService).toBeDefined();
  });

  it('예약 리다이렉트 토큰 생성', async () => {
    /* emtpy */
  });

  it('유저가 리다이렉트 url 에서 예약 확정을 눌렀을때', async () => {
    /* emtpy */
  });
});
