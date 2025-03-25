import { hash, compare } from 'bcrypt';
import * as CryptoJS from 'crypto-js';

const config = {
  bcryptSaltRound: parseInt(process.env.BCRYPT_SALT_ROUND || '10', 10),
};

export class EncryptUtil {
  /**
   * 비밀번호 or 토큰 암호화
   */
  static async tokenEncode(value: string): Promise<string> {
    return await hash(value, config.bcryptSaltRound);
  }

  /**
   * 비밀번호 or 토큰 검증
   */
  static async verify(value: string, hashedValue: string): Promise<boolean> {
    return await compare(value, hashedValue);
  }

  /**
   * payload 암호화
   */
  static encode(payload: any, key: string): string {
    const plainText = JSON.stringify(payload);

    return CryptoJS.AES.encrypt(plainText, key).toString();
  }

  /**
   * payload 복호화
   */
  static decode(ciphertext: string, key: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);

    const result = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(result);
  }
}
