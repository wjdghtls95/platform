import { getTestModule } from '../utils/test.module';
import { TestingModule } from '@nestjs/testing';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from '../utils/test-transaction.utils';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';
import { FavoriteService } from '../../src/favorite/favorite.service';
import { FavoriteRepository } from '@libs/dao/platform/favorite/favorite.repository';
import { TestRedisDataSourceUtils } from '../utils/test-redis-data-source.utils';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { RedisUserFavoriteRepository } from '@libs/dao/platform/redis/redis-user-favorite.repository';
import { RedisUserGeoRepository } from '@libs/dao/platform/redis/redis-user-geo.repository';
import { AddFavoriteInDto } from '@libs/dao/platform/favorite/dto/add-favorite-in.dto';
import { TestUserUtils } from '../utils/test-user.utils';
import { User } from '@libs/dao/platform/user/users.entity';
import { GolfCourseRepository } from '@libs/dao/platform/golf-course/golf-course.repository';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { GolfCourse } from '@libs/dao/platform/golf-course/golf-course.entity';
import { KAKAO_CATEGORY_CODE } from '@libs/common/constants/kakao.constants';

describe('FavoriteService', () => {
  let module: TestingModule;

  let favoriteService: FavoriteService;

  let favoriteRepository: FavoriteRepository;
  let golfCourseRepository: GolfCourseRepository;

  // redis
  let userFavoriteRepository: RedisUserFavoriteRepository;
  let userGeoRepository: RedisUserGeoRepository;

  // others
  let user: User;
  let userId: number;

  beforeAll(async () => {
    module = await getTestModule;

    favoriteService = module.get<FavoriteService>(FavoriteService);

    favoriteRepository = module.get<FavoriteRepository>(FavoriteRepository);
    golfCourseRepository =
      module.get<GolfCourseRepository>(GolfCourseRepository);

    userFavoriteRepository = module.get<RedisUserFavoriteRepository>(
      RedisUserFavoriteRepository,
    );

    userGeoRepository = module.get<RedisUserGeoRepository>(
      RedisUserGeoRepository,
    );

    userId = 1;
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([
      DATABASE_NAME.FAVORITE,
      DATABASE_NAME.GOLF_COURSE,
      DATABASE_NAME.USER,
    ]);

    // test login
    user = await TestUserUtils.login(userId);
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

  it('Favorite Service Define', async () => {
    expect(favoriteService).toBeDefined();
  });

  it('골프장 근처 장소 즐겨찾기 추가', async () => {
    // 등록한 골프장이 없을때
    const addFavoriteInDto = new AddFavoriteInDto();

    try {
      await favoriteService.addFavorite(user.id, addFavoriteInDto);
      fail('GOLF_COURSE_NOT_FOUND not thrown');
    } catch (e) {
      expect(e.response.message).toBe(
        INTERNAL_ERROR_CODE.GOLF_COURSE_NOT_FOUND,
      );
    }

    // 골프장 등록
    const golfCourse = await createGolfCourseList(userId);

    addFavoriteInDto.golfCourseId = golfCourse.id;
    addFavoriteInDto.placeId = 1629103585;
    addFavoriteInDto.name = '영커피';
    addFavoriteInDto.category = KAKAO_CATEGORY_CODE.CAFE;
    addFavoriteInDto.lng = '126.631567100533';
    addFavoriteInDto.lat = '37.4016126382331';

    await favoriteService.addFavorite(userId, addFavoriteInDto);

    // DB 저장 확인
    const favoritePlace = await favoriteRepository.findManyByUserId(userId);

    expect(favoritePlace).toBeDefined();
    expect(favoritePlace.length).toEqual(1);

    // Redis 저장 확인
    const redisFavoritePlace = await userFavoriteRepository.getFavorites(
      userId,
      golfCourse.id,
    );

    expect(redisFavoritePlace).toBeDefined();

    // Redis GEO 저장 확인
    const geoResult = await userGeoRepository.geoSearch(userId, {
      golfCourseId: golfCourse.id,
      lat: addFavoriteInDto.lat,
      lng: addFavoriteInDto.lng,
      radius: 2000,
      unit: 'm',
    });

    expect(geoResult).toContain(String(addFavoriteInDto.placeId));

    // 중복된 즐겨찾기 일때
    try {
      await favoriteService.addFavorite(userId, addFavoriteInDto);
      fail('FAVORITE_PLACE_ALREADY_EXISTED not thrown');
    } catch (e) {
      expect(e.response.message).toBe(
        INTERNAL_ERROR_CODE.FAVORITE_PLACE_ALREADY_EXISTED,
      );
    }
  });

  /**
   * 골프장 리스트에 등록 - 테스트
   */
  const createGolfCourseList = async (userId: number) => {
    const golfCourse = GolfCourse.create({
      userId: userId,
      golfCourseName: '프렌즈스크린 test',
      lng: '126.631565102012',
      lat: '37.4015594720479',
    });

    await golfCourseRepository.insert(golfCourse);

    return golfCourse;
  };
});
