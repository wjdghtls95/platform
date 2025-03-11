import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { AuthDto } from '@libs/dao/auth/dto/auth.dto';
import { ResponseEntity } from '@libs/common/networks/response-entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiResponseEntity({ summary: '유저 회원가입' })
  async create(@Body() authIndDto: AuthDto): Promise<ResponseEntity<AuthDto>> {
    const authDto = await this.authService.register(authIndDto);

    return ResponseEntity.ok().body(authDto);
  }
}
