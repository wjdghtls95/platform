import { Inject, Injectable } from '@nestjs/common';
import { FavoriteRepository } from '@libs/dao/platform/favorite/favorite.repository';
import { AddFavoriteInDto } from '@libs/dao/platform/favorite/dto/add-favorite-in.dto';
import { AddFavoriteOutDto } from '@libs/dao/platform/favorite/dto/add-favorite-out.dto';
import { Favorite } from '@libs/dao/platform/favorite/favorite.entity';
import { RedisUserFavoriteRepository } from '@libs/dao/platform/redis/redis-user-favorite.repository';
import { RedisUserGeoRepository } from '@libs/dao/platform/redis/redis-user-geo.repository';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { Transactional } from '@libs/common/decorators/transaction.decorator';
import { RedisGeoSearchDto } from '@libs/dao/platform/redis/dto/redis-geo-search.dto';
import { GolfCourseRepository } from '@libs/dao/platform/golf-course/golf-course.repository';

@Injectable()
export class FavoriteService {
  constructor(
    @Inject(FavoriteRepository)
    private readonly favoriteRepository: FavoriteRepository,
    @Inject(GolfCourseRepository)
    private readonly golfCourseRepository: GolfCourseRepository,

    private readonly redisUserFavoriteRepository: RedisUserFavoriteRepository,
    private readonly redisUserGeoRepository: RedisUserGeoRepository,
  ) {}

  /**
   * 즐겨찾기 추가
   */
  @Transactional()
  async addFavorite(
    userId: number,
    addFavoriteInDto: AddFavoriteInDto,
  ): Promise<AddFavoriteOutDto> {
    const { golfCourseId, placeId, name, category, lat, lng } =
      addFavoriteInDto;

    // 골프장 리스트에 존재 확인
    const golfCourse = await this.golfCourseRepository.findById(golfCourseId);

    if (!golfCourse) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.GOLF_COURSE_NOT_FOUND);
    }

    // 이미 즐겨찾기 인지 확인
    const existingFavorites =
      await this.redisUserFavoriteRepository.getFavorites(userId, golfCourseId);

    if (existingFavorites[placeId]) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.FAVORITE_PLACE_ALREADY_EXISTED,
      );
    }

    try {
      // DB 저장
      const favoritePlace = Favorite.create({
        userId: userId,
        golfCourseId: golfCourseId,
        placeId: placeId,
        name: name,
        category: category,
        lng: lng,
        lat: lat,
      });

      await this.favoriteRepository.insert(favoritePlace);

      // Redis Hash 업데이트
      existingFavorites[placeId] = addFavoriteInDto;

      await this.redisUserFavoriteRepository.setFavorites(
        userId,
        golfCourseId,
        existingFavorites,
      );

      // Redis GEO 위치 정보 저장
      await this.redisUserGeoRepository.geoAdd(
        userId,
        golfCourseId,
        placeId,
        lat,
        lng,
      );

      return AddFavoriteOutDto.of(favoritePlace);
    } catch (e) {
      // Redis Rollback (정합성 맞추기 위해 삭제)
      await Promise.all([
        this.redisUserFavoriteRepository.removeFavorite(
          userId,
          golfCourseId,
          placeId,
        ),
        this.redisUserGeoRepository.remove(userId, golfCourseId, placeId),
      ]);

      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.FAVORITE_PLACE_SAVE_FAILED,
      );
    }
  }

  /**
   * 즐겨찾기 조회 (hash 조회)
   */
  async getFavorite(
    userId: number,
    golfCourseId: number,
  ): Promise<AddFavoriteOutDto[]> {
    const favoritePlaces = await this.redisUserFavoriteRepository.getFavorites(
      userId,
      golfCourseId,
    );

    return Object.values(favoritePlaces).map((it) => AddFavoriteOutDto.of(it));
  }

  /**
   * 반경 내 즐겨찾기 장소 조회 (GEO 기준 → 상세 정보 결합 필요)
   */
  async getFavoritesInRadius(
    userId: number,
    redisGeoSearchDto: RedisGeoSearchDto,
  ): Promise<AddFavoriteOutDto[]> {
    const golfCourse = await this.golfCourseRepository.findById(
      redisGeoSearchDto.golfCourseId,
    );

    if (!golfCourse) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.GOLF_COURSE_NOT_FOUND);
    }

    redisGeoSearchDto.lng = redisGeoSearchDto.lng ?? golfCourse.lng;
    redisGeoSearchDto.lat = redisGeoSearchDto.lat ?? golfCourse.lat;

    const placeIds = await this.redisUserGeoRepository.geoSearch(
      userId,
      redisGeoSearchDto,
    );

    const favoritePlaces = await this.redisUserFavoriteRepository.getFavorites(
      userId,
      golfCourse.id,
    );

    return placeIds
      .map((id: number) => favoritePlaces[id])
      .filter((place) => place)
      .map((place) => AddFavoriteOutDto.of(place));
  }

  /**
   * 즐겨찾기 삭제
   */
  async removeFavorite(
    userId: number,
    golfCourseId: number,
    placeId: number,
  ): Promise<void> {
    try {
      await Promise.all([
        this.redisUserFavoriteRepository.removeFavorite(
          userId,
          golfCourseId,
          placeId,
        ),
        this.redisUserGeoRepository.remove(userId, golfCourseId, placeId),
        this.favoriteRepository.deleteByUserIdAndPlace(
          userId,
          golfCourseId,
          placeId,
        ),
      ]);
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.FAVORITE_PLACE_DELETE_FAILED,
      );
    }
  }
}
