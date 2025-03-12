import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { RegisterDto } from '@libs/dao/auth/dto/register.dto';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { LoginOutDto } from '@libs/dao/auth/dto/login-out.dto';
import { LoginInDto } from '@libs/dao/auth/dto/login-in.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiResponseEntity({ summary: '유저 회원가입' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseEntity<RegisterDto>> {
    const userRegister = await this.authService.register(registerDto);

    return ResponseEntity.ok().body(userRegister);
  }

  @Post('/login')
  @ApiResponseEntity({ summary: '로그인' })
  async login(
    @Body() loginInDto: LoginInDto,
  ): Promise<ResponseEntity<LoginOutDto>> {
    const loginOutDto = await this.authService.login(loginInDto);

    return ResponseEntity.ok().body(loginOutDto);
  }
}
