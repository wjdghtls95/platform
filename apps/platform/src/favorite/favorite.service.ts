import { Inject, Injectable } from '@nestjs/common';
import { FavoriteRepository } from '@libs/dao/favorite/favorite.repository';
import { AddFavoriteInDto } from '@libs/dao/favorite/dto/add-favorite-in.dto';
import { AddFavoriteOutDto } from '@libs/dao/favorite/dto/add-favorite-out.dto';
import { Favorite } from '@libs/dao/favorite/favorite.entity';
import { RedisUserFavoriteRepository } from '@libs/dao/redis/redis-user-favorite.repository';
import { RedisUserGeoRepository } from '@libs/dao/redis/redis-user-geo.repository';

@Injectable()
export class FavoriteService {
  constructor(
    @Inject(FavoriteRepository)
    private readonly favoriteRepository: FavoriteRepository,
    private readonly redisUserFavoriteRepository: RedisUserFavoriteRepository,
    private readonly redisUserGeoRepository: RedisUserGeoRepository,
  ) {}

  /**
   * 즐겨찾기 추가
   */
  async addFavorite(
    userId: number,
    addFavoriteInDto: AddFavoriteInDto,
  ): Promise<AddFavoriteOutDto> {
    const { golfCourseId, placeId, name, category, lat, lng } =
      addFavoriteInDto;

    const prev = await this.redisUserFavoriteRepository.getFavorites(
      userId,
      golfCourseId,
    );

    prev[placeId] = addFavoriteInDto;

    await this.redisUserFavoriteRepository.setFavorites(
      userId,
      golfCourseId,
      prev,
    );

    await this.redisUserGeoRepository.geoAdd(
      userId,
      golfCourseId,
      placeId,
      lat,
      lng,
    );

    const favoritePlace = Favorite.create({
      userId: userId,
      golfCourseId: golfCourseId,
      placeId: placeId,
      name: name,
      category: category,
    });

    await this.favoriteRepository.insert(favoritePlace);

    return;
  }
}
