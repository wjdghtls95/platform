import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { GolfCourseService } from './golf-course.service';
import { SearchNearByInDto } from '@libs/dao/golf-course/dto/search-nearby-in.dto';
import { SearchPlaceInDto } from '@libs/dao/golf-course/dto/search-place-in.dto';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { SearchOutDto } from '@libs/dao/golf-course/dto/search-out.dto';
import { Auth } from '@libs/common/decorators/auth.decorator';
import { CurrentUser } from '@libs/common/decorators/current-user.decorator';
import { AuthPayload } from '@libs/dao/auth/interfaces/auth-payload.interface';
import { AddGolfCourseInDto } from '@libs/dao/golf-course/dto/add-golf-course-in.dto';
import { GolfCourseOutDto } from '@libs/dao/golf-course/dto/add-golf-course-out.dto';

@Controller('golf-course')
@ApiTags('Golf Course')
@Auth()
export class GolfCourseController {
  constructor(private readonly golfCourseService: GolfCourseService) {}

  @Post('/search/keyword')
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

  @Post('/my')
  @ApiResponseEntity({ summary: '골프장 리스트 추가' })
  async createGolfCourse(
    @CurrentUser() user: AuthPayload,
    @Body() addGolfCourseInDto: AddGolfCourseInDto,
  ): Promise<ResponseEntity<GolfCourseOutDto>> {
    const addGolfCourseOutDto = await this.golfCourseService.addGolfCourse(
      user.userId,
      addGolfCourseInDto,
    );

    return ResponseEntity.ok().body(addGolfCourseOutDto);
  }

  @Get('/my')
  @ApiResponseEntity({ summary: '골프장 리스트 조회' })
  async getGolfCourse(
    @CurrentUser() user: AuthPayload,
  ): Promise<ResponseEntity<GolfCourseOutDto[]>> {
    const getGolfCourses = await this.golfCourseService.getGolfCourse(
      user.userId,
    );

    return ResponseEntity.ok().body(getGolfCourses);
  }

  @Delete('/my/:id')
  @ApiResponseEntity({ summary: '골프장 리스트 삭제' })
  async deleteGolfCourse(
    @Param('id') id: string,
    @CurrentUser() user: AuthPayload,
  ): Promise<ResponseEntity<void>> {
    await this.golfCourseService.deleteGolfCourse(user.userId, Number(id));

    return ResponseEntity.ok().build();
  }
}
