import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@libs/common/decorators/auth.decorator';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { CurrentUser } from '@libs/common/decorators/current-user.decorator';
import { AuthPayload } from '@libs/dao/platform/auth/interfaces/auth-payload.interface';
import { AddFavoriteInDto } from '@libs/dao/platform/favorite/dto/add-favorite-in.dto';
import { FavoriteService } from './favorite.service';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { AddFavoriteOutDto } from '@libs/dao/platform/favorite/dto/add-favorite-out.dto';
import { RedisGeoSearchDto } from '@libs/dao/platform/redis/dto/redis-geo-search.dto';

@Controller('favorite')
@ApiTags('Favorite')
@Auth()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiResponseEntity({ summary: '유저 즐겨찾기 장소 추가' })
  async addFavorite(
    @CurrentUser() user: AuthPayload,
    @Body() addFavoriteInDto: AddFavoriteInDto,
  ): Promise<ResponseEntity<AddFavoriteOutDto>> {
    const addFavoriteOutDto = await this.favoriteService.addFavorite(
      user.userId,
      addFavoriteInDto,
    );

    return ResponseEntity.ok().body(addFavoriteOutDto);
  }

  @Get()
  @ApiResponseEntity({ summary: '즐겨찾기 전체 조회 (Hash 기반)' })
  async getFavorite(
    @CurrentUser() user: AuthPayload,
    @Query('golfCourseId') golfCourseId: number,
  ): Promise<ResponseEntity<AddFavoriteOutDto[]>> {
    const favorites = await this.favoriteService.getFavorite(
      user.userId,
      golfCourseId,
    );

    return ResponseEntity.ok().body(favorites);
  }

  @Post('/radius')
  @ApiResponseEntity({ summary: '반경 내 즐겨찾기 장소 조회 (Geo 기반)' })
  async getFavoritesInRadius(
    @CurrentUser() user: AuthPayload,
    @Body() redisGeoSearchDto: RedisGeoSearchDto,
  ): Promise<ResponseEntity<AddFavoriteOutDto[]>> {
    const favorites = await this.favoriteService.getFavoritesInRadius(
      user.userId,
      redisGeoSearchDto,
    );

    return ResponseEntity.ok().body(favorites);
  }

  @Delete()
  @ApiResponseEntity({ summary: '즐겨찾기 삭제' })
  async deleteFavorite(
    @CurrentUser() user: AuthPayload,
    @Query('golfCourseId') golfCourseId: number,
    @Query('placeId') placeId: number,
  ): Promise<ResponseEntity<void>> {
    await this.favoriteService.removeFavorite(
      user.userId,
      golfCourseId,
      placeId,
    );

    return ResponseEntity.ok().build();
  }
}
