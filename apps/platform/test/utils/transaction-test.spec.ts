import { TestingModule } from '@nestjs/testing';
import { AuthRepository } from '@libs/dao/platform/auth/auth.repository';
import { AuthService } from '../../src/auth/auth.service';
import { getTestModule } from './test.module';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from './test-transaction.utils';
import { TestDataSourceUtils } from './test-data-source.utils';
import { UsersRepository } from '@libs/dao/platform/user/users.repository';
import { RegisterDto } from '@libs/dao/platform/auth/dto/register.dto';
import { AUTH_TYPE } from '@libs/common/constants/auth.constants';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { TestRedisDataSourceUtils } from './test-redis-data-source.utils';

describe('Transaction Test', () => {
  let module: TestingModule;

  /**
   * service
   */
  let authService: AuthService;

  /**
   * repository
   */
  let authRepository: AuthRepository;
  let usersRepository: UsersRepository;

  /**
   * variable
   */
  let testUser: string;

  beforeAll(async () => {
    module = await getTestModule;

    authService = module.get<AuthService>(AuthService);

    authRepository = module.get<AuthRepository>(AuthRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);

    // test user 초기화
    testUser = `test-user-${Date.now()}`;
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([process.env.PLATFORM_DB_NAME]);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
    await TestRedisDataSourceUtils.redisFlushDb(module);
  });

  afterAll(async () => {
    await TestDataSourceUtils.clearDataSource(module);
    await TestRedisDataSourceUtils.clearRedisDataSource(module);
    await module.close();
  });

  it('트랜잭션 성공시 데이터가 정상적으로 저장', async () => {
    const authInDto = new RegisterDto();
    authInDto.name = testUser;
    authInDto.email = 'test@test.test';
    authInDto.authType = AUTH_TYPE.EMAIL;
    authInDto.password = '123qwe';

    // 회원가입 실행 (트랜잭션 적용)
    await authService.register(authInDto);

    // 트랜잭션 커밋 후 데이터가 DB에 존재하는지 확인
    const auth = await authRepository.findByEmail(authInDto.email);
    const user = await usersRepository.findById(auth.userId);

    expect(auth).toBeDefined();
    expect(auth.userId).toBe(user.id);
    expect(auth.email).toBe(authInDto.email);
    expect(auth.authType).toBe(AUTH_TYPE.EMAIL);
    expect(user.name).toBe(authInDto.name);
  });

  it('트랜잭션 실패 시 데이터 롤백 (중복 이메일 등록 시)', async () => {
    const authInDto = new RegisterDto();
    authInDto.name = testUser;
    authInDto.email = 'test@test.test';
    authInDto.authType = AUTH_TYPE.EMAIL;
    authInDto.password = '123qwe';

    // 회원가입 실행 (트랜잭션 적용)
    await authService.register(authInDto);

    const authInDto2 = new RegisterDto();
    authInDto2.name = testUser + 1;
    authInDto2.email = 'test@test.test';
    authInDto2.authType = AUTH_TYPE.EMAIL;
    authInDto2.password = '123qwe';

    try {
      await authService.register(authInDto2);
      fail('USER_ALREADY_CREATED no thrown');
    } catch (e) {
      expect(e.response.message).toEqual(
        INTERNAL_ERROR_CODE.USER_ALREADY_CREATED,
      );
    }

    const emails: string[] = [];

    emails.push(authInDto2.email);

    // 중복된 유저 등록시 트랜잭션 롤백
    const checkDuplicatedUser = await authRepository.findByEmailIn(emails);

    expect(checkDuplicatedUser.length).toBe(1);
  });
});
