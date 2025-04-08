import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@libs/common/decorators/auth.decorator';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { CurrentUser } from '@libs/common/decorators/current-user.decorator';
import { AuthPayload } from '@libs/dao/auth/interfaces/auth-payload.interface';
import { AddFavoriteInDto } from '@libs/dao/favorite/dto/add-favorite-in.dto';
import { FavoriteService } from './favorite.service';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { AddFavoriteOutDto } from '@libs/dao/favorite/dto/add-favorite-out.dto';

@Controller('favorite')
@ApiTags('Favorite')
@Auth()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('/add')
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

  @Get('')
  @ApiResponseEntity({ summary: '유저 즐겨찾기 장소 조회' })
  async getFavorite(
    @CurrentUser() user: AuthPayload,
    @Query('golfCourseId') golfCourseId: number,
  ): Promise<any> {}
}
