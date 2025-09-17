import { getTestModule } from '../utils/test.module';
import { TestingModule } from '@nestjs/testing';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from '../utils/test-transaction.utils';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';
import { TestRedisDataSourceUtils } from '../utils/test-redis-data-source.utils';
import { GolfCourseService } from '../../src/golf-course/golf-course.service';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { GolfCourseRepository } from '@libs/dao/platform/golf-course/golf-course.repository';
import { TestUserUtils } from '../utils/test-user.utils';
import { AddGolfCourseInDto } from '@libs/dao/platform/golf-course/dto/add-golf-course-in.dto';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

describe('Golf Course Service', () => {
  let module: TestingModule;

  let golfCourseService: GolfCourseService;

  let golfCourseRepository: GolfCourseRepository;

  let userId: number;

  beforeAll(async () => {
    module = await getTestModule;

    golfCourseService = module.get<GolfCourseService>(GolfCourseService);

    golfCourseRepository =
      module.get<GolfCourseRepository>(GolfCourseRepository);

    userId = 1;
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([DATABASE_NAME.GOLF_COURSE]);

    // test login
    await TestUserUtils.login(userId);
  });

  afterEach(async () => {
    await Promise.all([
      TestTransactionUtils.rollback(),
      TestRedisDataSourceUtils.redisFlushDb(module),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      TestDataSourceUtils.clearDataSource(module),
      TestRedisDataSourceUtils.clearRedisDataSource(module),
    ]);
  });

  it('Golf Course Service define', async () => {
    expect(golfCourseService).toBeDefined();
  });

  it('골프장 리스트 추가', async () => {
    const addGolfCourseInDto = new AddGolfCourseInDto();
    addGolfCourseInDto.golfCourseName = '프렌즈 스크린';
    addGolfCourseInDto.lng = '126.631565102012';
    addGolfCourseInDto.lat = '37.4015594720479';

    // 골프장 리스트 추가
    await golfCourseService.addGolfCourse(userId, addGolfCourseInDto);

    const golfCourse = await golfCourseRepository.findByUserId(userId);

    expect(golfCourse).toBeDefined();
    expect(golfCourse.golfCourseName).toBe(addGolfCourseInDto.golfCourseName);
    expect(golfCourse.lng).toBe(addGolfCourseInDto.lng);
    expect(golfCourse.lat).toBe(addGolfCourseInDto.lat);

    // 이미 등록된 골프장 리스트
    try {
      await golfCourseService.addGolfCourse(userId, addGolfCourseInDto);
      fail('GOLF_COURSE_ALREADY_CREATED not thrown');
    } catch (e) {
      expect(e.response.message).toBe(
        INTERNAL_ERROR_CODE.GOLF_COURSE_ALREADY_CREATED,
      );
    }
  });

  it('골프장 리스트 조회', async () => {
    const addGolfCourseInDto = new AddGolfCourseInDto();
    addGolfCourseInDto.golfCourseName = '프렌즈 스크린';
    addGolfCourseInDto.lng = '126.631565102012';
    addGolfCourseInDto.lat = '37.4015594720479';

    // 골프장 리스트 추가
    await golfCourseService.addGolfCourse(userId, addGolfCourseInDto);

    // 조회
    const golfCourses = await golfCourseService.getGolfCourse(userId);

    expect(golfCourses.length).toBe(1);
    expect(golfCourses[0].golfCourseName).toBe(
      addGolfCourseInDto.golfCourseName,
    );
    expect(golfCourses[0].lng).toBe(addGolfCourseInDto.lng);
    expect(golfCourses[0].lat).toBe(addGolfCourseInDto.lat);
  });
});
