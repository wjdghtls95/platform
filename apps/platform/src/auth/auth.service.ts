import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '@libs/dao/auth/auth.repository';
import { UsersRepository } from '@libs/dao/users/users.repository';
import { AuthDto } from '@libs/dao/auth/dto/auth.dto';
import { ServerErrorException } from '@libs/common/exception/server-errror.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { AUTH_TYPE } from '@libs/common/constants/auth.constants';
import { Users } from '@libs/dao/users/users.entity';
import { Auth } from '@libs/dao/auth/auth.entity';
import { hash } from 'bcrypt';
import { EmailAuthOutDto, OAuthOutDto } from '@libs/dao/auth/dto/auth-out.dto';
import { Transactional } from '@libs/common/decorators/transaction.decorator';

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
  async register(authDto: AuthDto): Promise<AuthDto> {
    await this._checkExistUser(authDto.email);

    switch (authDto.authType) {
      case AUTH_TYPE.EMAIL: {
        return this._registerByEmail(authDto);
      }

      case AUTH_TYPE.GOOGLE: {
        return this._registerByGoogle(authDto);
      }
    }
  }

  /**
   * 유저 생성
   */
  private async _createUser(name: string, email: string): Promise<Users> {
    const user = Users.create({ name: name, email: email });

    await this.usersRepository.insert(user);

    return user;
  }

  /**
   * 이메일로 회원가입
   */
  private async _registerByEmail(authDto: AuthDto): Promise<EmailAuthOutDto> {
    if (!authDto.password) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.AUTH_PASSWORD_NOT_FOUND,
      );
    }

    const user = await this._createUser(authDto.name, authDto.email);

    const auth = Auth.create({
      userId: user.id,
      authType: AUTH_TYPE.EMAIL,
      password: await hash(authDto.password, 10),
    });

    await this.authRepository.insert(auth);

    return { ...AuthDto.fromEntity(auth), email: authDto.email };
  }

  /**
   * Google 로 회원가입
   */
  private async _registerByGoogle(authDto: AuthDto): Promise<OAuthOutDto> {
    return;
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
}
