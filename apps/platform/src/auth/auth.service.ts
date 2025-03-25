import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '@libs/dao/auth/auth.repository';
import { UsersRepository } from '@libs/dao/user/users.repository';
import { RegisterDto } from '@libs/dao/auth/dto/register.dto';
import { ServerErrorException } from '@libs/common/exception/server-errror.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { AUTH_TYPE } from '@libs/common/constants/auth.constants';
import { User } from '@libs/dao/user/users.entity';
import { RegisterOutDto } from '@libs/dao/auth/dto/register-out.dto';
import { Transactional } from '@libs/common/decorators/transaction.decorator';
import { LoginInDto } from '@libs/dao/auth/dto/login-in.dto';
import { LoginOutDto } from '@libs/dao/auth/dto/login-out.dto';
import { EncryptUtil } from '@libs/common/utils/encrypt.util';
import { AuthPayload } from '@libs/dao/auth/interfaces/auth-payload.interface';
import { REFRESH_TOKEN_UPDATE_TTL } from '@libs/common/constants/token.constants';
import { OAuthTokenDto } from '@libs/dao/auth/dto/oauth-token.dto';
import { OAuthGoogleService } from './google/oauth-google.service';
import { AccessToken, TokenUtil } from '@libs/common/utils/token.util';
import { RefreshAccessTokenInDto } from '@libs/dao/auth/dto/refresh-access-token-in.dto';
import { OAuthVerifyOutDto } from '@libs/dao/auth/dto/oauth-verify-out.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
    private readonly oauthGoogleService: OAuthGoogleService,
  ) {}

  /**
   * 유저 회원가입
   */
  @Transactional()
  async register(registerDto: RegisterDto): Promise<RegisterOutDto> {
    const user = await this._checkAndCreateUser(registerDto);

    return RegisterOutDto.of({
      userId: user.id,
      name: registerDto.name,
      email: registerDto.email,
      authType: user.authType,
      password: user.password,
    });

    /**
     * TODO.. 리펙토링 될 만한것
     * const registerStrategies: Record<AUTH_TYPE, (dto: RegisterDto) => Promise<RegisterDto>> = {
     *   [AUTH_TYPE.EMAIL]: this._registerByEmail.bind(this),
     *   [AUTH_TYPE.GOOGLE]: this._registerByGoogle.bind(this),
     * };
     *
     * return registerStrategies[registerDto.authType](registerDto);
     */
  }

  /**
   * 로그인 & token 관리
   */
  async login(loginInDto: LoginInDto): Promise<LoginOutDto> {
    const { email, password } = loginInDto;

    const user = await this._checkUser(email, password);

    // accessToken, refreshToken 생성
    const { accessToken, refreshToken } =
      await this._generateAccessTokenAndRefreshToken({
        userId: user.id,
        email: user.email,
      });

    // refresh token DB 저장
    await this.usersRepository.updateById(user.id, {
      refreshToken: refreshToken,
    });

    return LoginOutDto.fromEntity(user).setToken(accessToken);
  }

  /**
   * 구글 로그인
   * TODO.. 다른 social 로그인 추가시 delegate 사용하면 될듯
   */
  @Transactional()
  async googleLogin(code: string): Promise<OAuthTokenDto> {
    const getPlatformTokenOutDto =
      await this.oauthGoogleService.getPlatformToken(code);

    const oAuthGoogleInfo = await this.oauthGoogleService.verifyPlatformToken(
      getPlatformTokenOutDto.platformToken,
    );

    let user = await this.usersRepository.findByEmail(oAuthGoogleInfo.email);

    if (!user) {
      user = this.usersRepository.create({
        name: oAuthGoogleInfo.name ?? null,
        email: oAuthGoogleInfo.email,
        authType: AUTH_TYPE.GOOGLE,
        providerId: oAuthGoogleInfo.providerId,
      });

      await this.usersRepository.insert(user);
    }

    const { accessToken, refreshToken } =
      await this._generateAccessTokenAndRefreshToken({
        userId: user.id,
        email: user.email,
      });

    await this.usersRepository.updateById(user.id, {
      refreshToken: refreshToken,
    });

    return OAuthTokenDto.of({
      userId: user.id,
      email: user.email,
      name: user.name ?? null,
      accessToken: accessToken,
    });
  }

  /**
   * refresh token 재발급
   */
  async refreshAccessToken(
    refreshAccessTokenInDto: RefreshAccessTokenInDto,
  ): Promise<OAuthVerifyOutDto> {
    const { accessToken, refreshToken } = refreshAccessTokenInDto;

    const { userId } = this._decodeAccessToken(accessToken);

    const user = await this.usersRepository.findById(userId);

    // 유저 존재 확인
    if (!user) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    // 유저 refresh token 유효한지 확인
    if (user.refreshToken !== refreshToken) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.LOGIN_REFRESH_TOKEN_INVALIDATE,
      );
    }

    // refresh token 의 ttl 조회
    const ttl = this._decodeRefreshToken(refreshToken);

    // ttl 존재 확인
    if (!ttl) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.LOGIN_REFRESH_TOKEN_INVALIDATE,
      );
    }

    const now = new Date().getTime();

    // ttl 만료 확인
    if (ttl < now) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.LOGIN_REFRESH_TOKEN_EXPIRED,
      );
    }

    // ttl 만료 안됬을때 refresh token 갱신 업데이트
    if (ttl - REFRESH_TOKEN_UPDATE_TTL < now) {
      user.refreshToken = TokenUtil.generateRefreshToken();
      await this.usersRepository.updateById(user.id, user);
    }

    return OAuthVerifyOutDto.of({
      accessToken: TokenUtil.generateAccessToken(user.id),
      refreshToken: user.refreshToken,
    });
  }

  /**
   * 유저 체크 & 생성
   */
  private async _checkAndCreateUser(registerDto: RegisterDto): Promise<User> {
    // password 존재 유무 체크
    if (!registerDto.password) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.AUTH_PASSWORD_NOT_FOUND,
      );
    }

    // 유저 존재 체크
    const checkUser = await this.usersRepository.findByEmail(registerDto.email);

    if (checkUser) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_ALREADY_CREATED);
    }

    // 유저 생성 & insert
    const user = User.create({
      name: registerDto.name,
      email: registerDto.email,
      password: await EncryptUtil.tokenEncode(registerDto.password),
      authType: registerDto.authType,
    });

    await this.usersRepository.insert(user);

    return user;
  }

  /**
   * 유저 로그인 정보 체크
   */
  private async _checkUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    // 유저가 존재하지 않을때
    if (!user) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    // 이메일이 유효하지 않을때
    if (user.email !== email) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_EMAIL_INVALID);
    }

    if (user.authType === AUTH_TYPE.EMAIL) {
      const verifyPassword = await EncryptUtil.verify(password, user.password);

      // 비밀번호가 유효하지 않을때
      if (!verifyPassword) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.USER_PASSWORD_INVALID,
        );
      }
    }

    return user;
  }

  /**
   * AccessToken & reFreshToken 생성
   */
  private async _generateAccessTokenAndRefreshToken(
    authPayload: AuthPayload,
  ): Promise<Record<string, string>> {
    return {
      accessToken: TokenUtil.generateAccessToken(authPayload.userId),
      refreshToken: TokenUtil.generateRefreshToken(),
    };
  }

  /**
   * access token 복호화
   */
  private _decodeAccessToken(accessToken: string): AccessToken {
    try {
      return TokenUtil.decodeAccessToken(accessToken);
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.LOGIN_ACCESS_TOKEN_INVALIDATE,
      );
    }
  }

  /**
   * refresh token 복호화
   */
  private _decodeRefreshToken(refreshToken: string): number {
    try {
      return TokenUtil.decodeRefreshToken(refreshToken);
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.LOGIN_ACCESS_TOKEN_INVALIDATE,
      );
    }
  }
}
