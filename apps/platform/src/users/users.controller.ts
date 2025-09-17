import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RealIp } from 'nestjs-real-ip';
import { UsersService } from './users.service';
import { UserLocationOutDto } from '@libs/dao/platform/user/dto/user-location-out.dto';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { Auth } from '@libs/common/decorators/auth.decorator';

@Controller('users')
@ApiTags('Users')
@Auth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/location')
  @ApiResponseEntity({ summary: '유저 위치 조회' })
  async getUserLocationByIp(
    @Req() req: Request,
    @RealIp() realIp: string,
  ): Promise<ResponseEntity<UserLocationOutDto>> {
    const userLocationOutDto = await this.usersService.getUserLocationByIp(
      req,
      realIp,
    );

    return ResponseEntity.ok().body(userLocationOutDto);
  }
}
