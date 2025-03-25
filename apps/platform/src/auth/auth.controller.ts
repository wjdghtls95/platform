import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { RegisterDto } from '@libs/dao/auth/dto/register.dto';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { LoginInDto } from '@libs/dao/auth/dto/login-in.dto';
import { RegisterOutDto } from '@libs/dao/auth/dto/register-out.dto';
import { AuthGuard } from '@nestjs/passport';
import { OAuthTokenDto } from '@libs/dao/auth/dto/oauth-token.dto';
import { RefreshAccessTokenInDto } from '@libs/dao/auth/dto/refresh-access-token-in.dto';
import { OAuthVerifyOutDto } from '@libs/dao/auth/dto/oauth-verify-out.dto';
import { LoginOutDto } from '@libs/dao/auth/dto/login-out.dto';

@Controller('auth')
@ApiTags('Auth')
// @Auth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiResponseEntity({ type: RegisterOutDto, summary: '유저 회원가입' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseEntity<RegisterOutDto>> {
    const userRegister = await this.authService.register(registerDto);

    return ResponseEntity.ok().body(userRegister);
  }

  @Post('/login')
  @ApiResponseEntity({ type: LoginOutDto, summary: '로그인' })
  async login(
    @Body() loginInDto: LoginInDto,
  ): Promise<ResponseEntity<LoginOutDto>> {
    const loginOutDto = await this.authService.login(loginInDto);

    return ResponseEntity.ok().body(loginOutDto);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  loginPage(): void {
    return;
  }

  @Get('/google/callback')
  async callback(
    @Query('code') code: string,
  ): Promise<ResponseEntity<OAuthTokenDto>> {
    const oauthTokenDto = await this.authService.googleLogin(code);

    return ResponseEntity.ok().body(oauthTokenDto);
  }

  @Post('/token/refresh')
  @ApiResponseEntity({ type: OAuthVerifyOutDto, summary: 'accessToken 갱신' })
  async RefreshAccessToken(
    @Body() refreshAccessTokenInDto: RefreshAccessTokenInDto,
  ): Promise<ResponseEntity<OAuthVerifyOutDto>> {
    const oauthVerifyOutDto = await this.authService.refreshAccessToken(
      refreshAccessTokenInDto,
    );

    return ResponseEntity.ok().body(oauthVerifyOutDto);
  }
}
