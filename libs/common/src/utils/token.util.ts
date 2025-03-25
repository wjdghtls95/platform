import { EncryptUtil } from '@libs/common/utils/encrypt.util';
import {
  ACCESS_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_TTL,
} from '@libs/common/constants/token.constants';

export interface AccessToken {
  userId: number;
  ttl: number;
}

export class TokenUtil {
  /**
   * access token 생성
   */
  static generateAccessToken(userId: number): string {
    return EncryptUtil.encode(
      {
        userId: userId,
        ttl: new Date().getTime() + ACCESS_TOKEN_TTL,
      },
      ACCESS_TOKEN_SECRET_KEY,
    );
  }

  /**
   * access token 복호화
   */
  static decodeAccessToken(accessToken: string): AccessToken {
    {
      return EncryptUtil.decode(
        accessToken,
        ACCESS_TOKEN_SECRET_KEY,
      ) satisfies AccessToken;
    }
  }

  /**
   * refresh token 생성
   */
  static generateRefreshToken(): string {
    const ttl = {
      ttl: new Date().getTime() + REFRESH_TOKEN_TTL,
    };

    return EncryptUtil.encode(ttl, REFRESH_TOKEN_SECRET_KEY);
  }

  /**
   * refresh token 복호화
   */
  static decodeRefreshToken(refreshToken: string): number {
    const { ttl } = EncryptUtil.decode(refreshToken, REFRESH_TOKEN_SECRET_KEY);

    return ttl;
  }
}
