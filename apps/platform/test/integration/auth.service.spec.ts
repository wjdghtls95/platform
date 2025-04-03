import { getTestModule } from '../utils/test.module';
import { TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from '../utils/test-transaction.utils';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';
import { AUTH_TYPE } from '@libs/common/constants/auth.constants';
import { RegisterDto } from '@libs/dao/auth/dto/register.dto';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { UsersRepository } from '@libs/dao/user/users.repository';
import { LoginInDto } from '@libs/dao/auth/dto/login-in.dto';
import { AuthRepository } from '@libs/dao/auth/auth.repository';

describe('AuthService', () => {
  let module: TestingModule;

  let authService: AuthService;

  let authRepository: AuthRepository;
  let usersRepository: UsersRepository;

  let email: string;

  beforeAll(async () => {
    module = await getTestModule;

    authService = module.get<AuthService>(AuthService);

    usersRepository = module.get<UsersRepository>(UsersRepository);
    authRepository = module.get<AuthRepository>(AuthRepository);

    email = 'authTester';
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([process.env.PLATFORM_DB_NAME]);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
  });

  afterAll(async () => {
    // await TestDataSourceUtils.clearDataSource(module);
    // await module.close();

    await Promise.all([
      TestDataSourceUtils.clearDataSource(module),
      module.close(),
    ]);
  });

  it('Auth Service define', async () => {
    expect(authService).toBeDefined();
  });

  it('회원가입', async () => {
    // password 없이 회원가입할때
    const registerDto = new RegisterDto();
    registerDto.name = 'tester';
    registerDto.email = email;
    registerDto.password = '';
    registerDto.authType = AUTH_TYPE.EMAIL;

    try {
      await authService.register(registerDto);
      fail('AUTH_PASSWORD_NOT_FOUND not thrown');
    } catch (e) {
      expect(e.response.message).toBe(
        INTERNAL_ERROR_CODE.AUTH_PASSWORD_NOT_FOUND,
      );
    }

    // 정상 회원가입
    registerDto.password = 'test';

    await authService.register(registerDto);

    const auth = await authRepository.findByEmail(registerDto.email);
    const user = await usersRepository.findById(auth.userId);

    expect(auth).toBeDefined();
    expect(auth.email).toEqual(registerDto.email);
    expect(user.name).toEqual(registerDto.name);

    // 중복 유저 회원가입
    const registerDto2 = new RegisterDto();
    registerDto2.name = 'tester';
    registerDto2.email = email;
    registerDto2.password = 'test';
    registerDto2.authType = AUTH_TYPE.EMAIL;

    try {
      await authService.register(registerDto2);
      fail('USER_ALREADY_CREATED not thrown');
    } catch (e) {
      expect(e.response.message).toEqual(
        INTERNAL_ERROR_CODE.USER_ALREADY_CREATED,
      );
    }
  });

  it('이메일 로그인', async () => {
    // 등록되지 않은 유저 로그인시
    const loginInDto = new LoginInDto();
    loginInDto.email = '';
    loginInDto.password = '1234';

    try {
      await authService.login(loginInDto);
      fail('USER_NOT_FOUND not thrown');
    } catch (e) {
      expect(e.response.message).toEqual(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    // 이메일 다른 유저 로그인
    const registerDto = new RegisterDto();
    registerDto.name = 'tester';
    registerDto.email = email;
    registerDto.password = '1234';
    registerDto.authType = AUTH_TYPE.EMAIL;

    await authService.register(registerDto);

    const auth = await authRepository.findByEmail(registerDto.email);
    const user = await usersRepository.findById(auth.userId);

    expect(user).toBeDefined();
    expect(user.name).toEqual(registerDto.name);
    expect(auth.email).toEqual(registerDto.email);

    loginInDto.email = 'wrongEmail';

    try {
      await authService.login(loginInDto);
      fail('USER_EMAIL_INVALID not thrown');
    } catch (e) {
      expect(e.response.message).toEqual(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }
  });
});
