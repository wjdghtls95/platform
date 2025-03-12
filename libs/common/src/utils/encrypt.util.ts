import { hash, compare } from 'bcrypt';

const config = {
  bcryptSaltRound: parseInt(process.env.BCRYPT_SALT_ROUND || '10', 10),
};

export class EncryptUtil {
  /**
   * 비밀번호 암호화
   */
  static async passwordEncode(password: string): Promise<string> {
    return await hash(password, config.bcryptSaltRound);
  }

  /**
   * 비밀번호 검증
   */
  static async passwordVerify(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
