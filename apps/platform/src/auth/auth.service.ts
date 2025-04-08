import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '@libs/dao/user/users.repository';
import { RegisterDto } from '@libs/dao/auth/dto/register.dto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
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
import { AuthRepository } from '@libs/dao/auth/auth.repository';
import { Auth } from '@libs/dao/auth/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
    private readonly oauthGoogleService: OAuthGoogleService,
  ) {}

  /**
   * 유저 회원가입
   */
  @Transactional()
  async register(registerDto: RegisterDto): Promise<RegisterOutDto> {
    await this._checkExistedUser(registerDto);

    // 유저 생성
    const user = User.create({
      name: registerDto.name,
      nickname:
        registerDto.nickname === ''
          ? this._generateNickname()
          : registerDto.nickname,
    });

    await this.usersRepository.insert(user);

    // auth 생성
    const auth = Auth.create({
      userId: user.id,
      email: registerDto.email,
      password: await EncryptUtil.tokenEncode(registerDto.password),
      authType: registerDto.authType,
    });

    await this.authRepository.insert(auth);

    return RegisterOutDto.of({
      userId: user.id,
      name: user.name,
      nickname: user.nickname,
      email: auth.email,
      authType: auth.authType,
      password: auth.password,
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

    const { user, auth } = await this._checkLoginInfo(email, password);

    // accessToken, refreshToken 생성
    const { accessToken, refreshToken } = await this._generateToken({
      userId: user.id,
      email: auth.email,
    });

    // refresh token DB 저장
    await this.authRepository.updateById(user.id, {
      refreshToken: refreshToken,
    });

    return LoginOutDto.fromEntity(auth).setToken(accessToken);
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

    let auth = await this.authRepository.findByEmail(oAuthGoogleInfo.email);

    let user: User;

    if (!auth) {
      user = User.create({
        nickname: this._generateNickname(),
      });

      await this.usersRepository.insert(user);

      auth = Auth.create({
        userId: user.id,
        email: oAuthGoogleInfo.email,
        authType: AUTH_TYPE.GOOGLE,
        providerId: oAuthGoogleInfo.providerId,
      });

      await this.authRepository.insert(auth);
    } else {
      user = await this.usersRepository.findById(auth.userId);
    }

    const { accessToken, refreshToken } = await this._generateToken({
      userId: user.id,
      email: auth.email,
    });

    await this.authRepository.updateById(user.id, {
      refreshToken: refreshToken,
    });

    return OAuthTokenDto.of({
      userId: user.id,
      email: auth.email,
      name: user.name ?? null,
      accessToken: accessToken,
    });
  }

  /**
   * refresh token 재발급 (TTL 기준)
   */
  async refreshAccessToken(
    refreshAccessTokenInDto: RefreshAccessTokenInDto,
  ): Promise<OAuthVerifyOutDto> {
    const { accessToken, refreshToken } = refreshAccessTokenInDto;

    const { userId } = this._decodeAccessToken(accessToken);

    const auth = await this.authRepository.findByUserId(userId);

    // 유저 존재 확인
    if (!auth) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    // 유저 refresh token 유효한지 확인
    if (auth.refreshToken !== refreshToken) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.LOGIN_REFRESH_TOKEN_INVALIDATE,
      );
    }

    // refresh token 의 ttl 조회
    const ttl = this._decodeRefreshToken(refreshToken);

    // ttl 유무 확인
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
      auth.refreshToken = TokenUtil.generateRefreshToken();

      await this.authRepository.updateById(userId, auth);
    }

    return OAuthVerifyOutDto.of({
      accessToken: TokenUtil.generateAccessToken(userId),
      refreshToken: auth.refreshToken,
    });
  }

  /**
   * 로그아웃
   */
  async logout(userId: number): Promise<void> {
    await this.authRepository.updateById(userId, { refreshToken: null });
  }

  /**
   * 유저 존재 체크
   */
  private async _checkExistedUser(registerDto: RegisterDto): Promise<void> {
    // Dto password 존재 유무 체크
    if (!registerDto.password) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.AUTH_PASSWORD_NOT_FOUND,
      );
    }

    // 유저 존재 체크
    const checkEmail = await this.authRepository.findByEmail(registerDto.email);

    if (checkEmail) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_ALREADY_CREATED);
    }
  }

  /**
   * 유저 로그인 정보 체크
   */
  private async _checkLoginInfo(
    email: string,
    password: string,
  ): Promise<{ user: User; auth: Auth }> {
    const auth = await this.authRepository.findByEmail(email);

    // 유저가 존재하지 않을때
    if (!auth) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    if (auth.authType === AUTH_TYPE.EMAIL) {
      const verifyPassword = await EncryptUtil.verify(password, auth.password);

      // 비밀번호가 유효하지 않을때
      if (!verifyPassword) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.USER_PASSWORD_INVALID,
        );
      }
    }

    const user = await this.usersRepository.findById(auth.userId);

    return { user: user, auth: auth };
  }

  /**
   * 닉네임 랜덤 자동 생성
   */
  private _generateNickname(): string {
    const uuid = crypto.randomUUID().slice(0, 5);

    const nickname = `Member_${uuid}`;

    return nickname;
  }

  /**
   * AccessToken & reFreshToken 생성
   */
  private async _generateToken(
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
