import { Inject, Injectable } from '@nestjs/common';
import { KakaoProvider } from '@libs/common/external/kakao/kakao.provider';
import { SearchPlaceInDto } from '@libs/dao/platform/golf-course/dto/search-place-in.dto';
import { SearchNearByInDto } from '@libs/dao/platform/golf-course/dto/search-nearby-in.dto';
import { SearchOutDto } from '@libs/dao/platform/golf-course/dto/search-out.dto';
import { KAKAO_CATEGORY_CODE } from '@libs/common/constants/kakao.constants';
import { AddGolfCourseInDto } from '@libs/dao/platform/golf-course/dto/add-golf-course-in.dto';
import { GolfCourseOutDto } from '@libs/dao/platform/golf-course/dto/add-golf-course-out.dto';
import { GolfCourseRepository } from '@libs/dao/platform/golf-course/golf-course.repository';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { GolfCourse } from '@libs/dao/platform/golf-course/golf-course.entity';

@Injectable()
export class GolfCourseService {
  constructor(
    @Inject(GolfCourseRepository)
    private readonly golfCourseRepository: GolfCourseRepository,
    private readonly kakaoProvider: KakaoProvider,
  ) {}

  /**
   골프장 검색
   */
  async findByKeyword(
    searchPlaceInDto: SearchPlaceInDto,
  ): Promise<SearchOutDto> {
    const { keyword, page, size } = searchPlaceInDto;

    const response = await this.kakaoProvider.get({
      method: 'keyword.json',
      params: {
        query: keyword,
        page,
        size,
      },
    });

    return SearchOutDto.of({
      totalCount: response.meta.total_count,
      isEnd: response.meta.is_end,
      documents: response.documents,
    });
  }

  /**
   * 골프장 근처 검색
   */
  async findNearByPlace(
    searchNearByInDto: SearchNearByInDto,
  ): Promise<SearchOutDto> {
    const { lng, lat, radius, category, page, size } = searchNearByInDto;

    const response = await this.kakaoProvider.get({
      method: 'category.json',
      params: {
        category_group_code: KAKAO_CATEGORY_CODE[category],
        x: lng,
        y: lat,
        radius: radius, //
        page,
        size,
      },
    });

    return SearchOutDto.of({
      totalCount: response.meta.total_count,
      isEnd: response.meta.is_end,
      documents: response.documents,
    });
  }

  /**
   * 골프장 리스트 추가
   */
  async addGolfCourse(
    userId: number,
    addGolfCourseInDto: AddGolfCourseInDto,
  ): Promise<GolfCourseOutDto> {
    const { golfCourseName, lng, lat } = addGolfCourseInDto;

    // 이미 등록된 골프장인지 확인
    const isExisted =
      await this.golfCourseRepository.findByUserIdAndCoordinates(
        userId,
        golfCourseName,
        lng,
        lat,
      );

    if (isExisted) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.GOLF_COURSE_ALREADY_CREATED,
      );
    }

    const golfCourse = GolfCourse.create({ userId, ...addGolfCourseInDto });

    await this.golfCourseRepository.insert(golfCourse);

    return GolfCourseOutDto.of(golfCourse);
  }

  /**
   * 골프장 리스트 조회
   */
  async getGolfCourse(userId: number): Promise<GolfCourseOutDto[]> {
    const golfCourses = await this.golfCourseRepository.findByUserIdIn(userId);

    return GolfCourseOutDto.fromEntities(golfCourses);
  }

  /**
   * 골프장 리스트 삭제
   */
  async deleteGolfCourse(userId: number, id: number): Promise<void> {
    // 유저가 등록한 골프장 리스트
    const listGolfCourse = await this.golfCourseRepository.findByUserIdIn(
      userId,
    );

    // TODO.. 의미가 있나 다시 생각해봐야됨
    // 삭제하려는 id가 존재하는지 확인
    const isExist = listGolfCourse.map((it) => it.id).includes(id);

    if (!isExist) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.GOLF_COURSE_NOT_FOUND);
    }

    await this.golfCourseRepository.deleteById(id);
  }
}
