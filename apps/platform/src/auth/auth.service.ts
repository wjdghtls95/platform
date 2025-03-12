import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '@libs/dao/auth/auth.repository';
import { UsersRepository } from '@libs/dao/users/users.repository';
import { RegisterDto } from '@libs/dao/auth/dto/register.dto';
import { ServerErrorException } from '@libs/common/exception/server-errror.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { AUTH_TYPE } from '@libs/common/constants/auth.constants';
import { Users } from '@libs/dao/users/users.entity';
import { Auth } from '@libs/dao/auth/auth.entity';
import * as jwt from 'jsonwebtoken';
import {
  EmailAuthOutDto,
  OAuthOutDto,
} from '@libs/dao/auth/dto/register-out.dto';
import { Transactional } from '@libs/common/decorators/transaction.decorator';
import { LoginInDto } from '@libs/dao/auth/dto/login-in.dto';
import { LoginOutDto } from '@libs/dao/auth/dto/login-out.dto';
import { EncryptUtil } from '@libs/common/utils/encrypt.util';
import { AuthPayload } from '@libs/dao/auth/interfaces/auth-payload.interface';
import { ACCESS_TOKEN_SECRET_KEY } from '@libs/common/constants/token.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * 유저 회원가입
   */
  @Transactional()
  async register(registerDto: RegisterDto): Promise<RegisterDto> {
    await this._checkExistUser(registerDto.email);

    switch (registerDto.authType) {
      case AUTH_TYPE.EMAIL: {
        return this._registerByEmail(registerDto);
      }

      case AUTH_TYPE.GOOGLE: {
        return this._registerByGoogle(registerDto);
      }

      default:
        throw new ServerErrorException(INTERNAL_ERROR_CODE.AUTH_TYPE_INVALID);
    }

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
   * 로그인 & jwt 생성
   */
  async login(loginInDto: LoginInDto): Promise<LoginOutDto> {
    const { email, password } = loginInDto;

    const user = await this.usersRepository.findByEmail(email);

    await this._checkUser(user, email, password);

    return LoginOutDto.fromEntity(user).setToken(
      this._generateAccessToken({
        userId: user.id,
        email: user.email,
      } satisfies AuthPayload),
    );
  }

  /**
   * 이메일로 회원가입
   */
  private async _registerByEmail(
    registerDto: RegisterDto,
  ): Promise<EmailAuthOutDto> {
    // password 존재 유무 체크
    if (!registerDto.password) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.AUTH_PASSWORD_NOT_FOUND,
      );
    }

    // 유저 생성
    const user = await this._createUser(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );

    // auth 생성
    const auth = Auth.create({
      userId: user.id,
      authType: AUTH_TYPE.EMAIL,
    });

    await this.authRepository.insert(auth);

    return RegisterDto.fromEntity(auth);
  }

  /**
   * Google 로 회원가입
   */
  private async _registerByGoogle(
    registerDto: RegisterDto,
  ): Promise<OAuthOutDto> {
    return;
  }

  /**
   * 유저 생성
   */
  private async _createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<Users> {
    // 유저 생성 & insert
    const user = Users.create({
      name: name,
      email: email,
      password: await EncryptUtil.passwordEncode(password),
    });

    await this.usersRepository.insert(user);

    return user;
  }

  /**
   * 유저 존재 체크
   */
  private async _checkExistUser(email: string): Promise<void> {
    const checkUser = await this.usersRepository.findByEmail(email);

    if (checkUser) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_ALREADY_CREATED);
    }
  }

  /**
   * user 로그인 정보 체크
   */
  private async _checkUser(
    user: Users,
    email: string,
    password: string,
  ): Promise<void> {
    // 유저가 존재하지 않을때
    if (!user) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    // 유저 이메일이 유효하지 않을때
    if (user.email !== email) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_EMAIL_INVALID);
    }

    const verifyPassword = await EncryptUtil.passwordVerify(
      password,
      user.password,
    );

    // 유저 비밀번호가 유효하지 않을때
    if (!verifyPassword) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_PASSWORD_INVALID);
    }
  }

  /**
   * access token 생성
   */
  private _generateAccessToken(authPayload: AuthPayload): string {
    return jwt.sign(authPayload, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });
  }
}
