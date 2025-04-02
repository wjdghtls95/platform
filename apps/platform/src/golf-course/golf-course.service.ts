import { Injectable } from '@nestjs/common';
import { KakaoProvider } from '@libs/common/external/kakao/kakao.provider';
import { SearchPlaceInDto } from '@libs/dao/golf-course/dto/search-place-in.dto';
import { SearchNearByInDto } from '@libs/dao/golf-course/dto/search-nearby-in.dto';
import { SearchOutDto } from '@libs/dao/golf-course/dto/search-out.dto';

@Injectable()
export class GolfCourseService {
  constructor(private readonly kakaoProvider: KakaoProvider) {}

  /**
   * 골프장 검색
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
    const { lng, lat, radius, kakaoCategoryCode, page, size } =
      searchNearByInDto;

    const response = await this.kakaoProvider.get({
      method: 'category.json',
      params: {
        category_group_code: kakaoCategoryCode,
        x: lng,
        y: lat,
        radius: radius, // 5km
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
}
