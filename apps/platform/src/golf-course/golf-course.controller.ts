import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { GolfCourseService } from './golf-course.service';
import { SearchNearByInDto } from '@libs/dao/golf-course/dto/search-nearby-in.dto';
import { SearchPlaceInDto } from '@libs/dao/golf-course/dto/search-place-in.dto';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { SearchOutDto } from '@libs/dao/golf-course/dto/search-out.dto';

@Controller('golf-course')
@ApiTags('golf-course')
export class GolfCourseController {
  constructor(private readonly golfCourseService: GolfCourseService) {}

  @Post()
  @ApiResponseEntity({ summary: '키워드로 장소 찾기' })
  async findByKeyword(
    @Body() searchPlaceInDto: SearchPlaceInDto,
  ): Promise<ResponseEntity<SearchOutDto>> {
    const searchOutDto = await this.golfCourseService.findByKeyword(
      searchPlaceInDto,
    );

    return ResponseEntity.ok().body(searchOutDto);
  }

  @Post('/search/nearby')
  @ApiResponseEntity({ summary: '근처 장소 찾기' })
  async findNearbyPlaces(
    @Body() searchNearByInDto: SearchNearByInDto,
  ): Promise<ResponseEntity<SearchOutDto>> {
    const searchOutDto = await this.golfCourseService.findNearByPlace(
      searchNearByInDto,
    );

    return ResponseEntity.ok().body(searchOutDto);
  }
}
