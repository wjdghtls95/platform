import { UsersRepository } from '@libs/dao/platform/user/users.repository';
import { User } from '@libs/dao/platform/user/users.entity';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { Auth } from '@libs/dao/platform/auth/auth.entity';
import { EncryptUtil } from '@libs/common/utils/encrypt.util';
import { AuthRepository } from '@libs/dao/platform/auth/auth.repository';

export class TestUserUtils {
  /**
   * 테스트 시 유저 로그인
   */
  static async login(userId: number, nickName?: string): Promise<User> {
    let user: any;

    try {
      user = await this.createUser(
        User.create({
          id: userId,
          nickname: nickName ?? `Member_${crypto.randomUUID().slice(0, 5)}`,
        }),
      );
    } catch (_) {
      /**
       *
       */
    }

    return user;
  }

  /**
   * 테스트 시 유저 생성
   */
  static async createUser(user: User): Promise<User> {
    const usersRepository = UsersRepository.instance(DATABASE_NAME.USER);
    const authRepository = AuthRepository.instance(DATABASE_NAME.AUTH);

    if (!usersRepository || !authRepository) return null;

    const auth = Auth.create({
      userId: user.id,
      email: 'jestTest@gmail.com',
      password: await EncryptUtil.tokenEncode('1234'),
      authType: 'email',
    });

    await Promise.all([
      usersRepository.insert(user),
      authRepository.insert(auth),
    ]);

    return user;
  }
}
