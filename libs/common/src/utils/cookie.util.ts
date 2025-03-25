import { Request, Response } from 'express';

export class CookieUtil {
  /**
   * Refresh Token을 HttpOnly 쿠키에 저장
   */
  static setRefreshToken(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // HTTPS 환경에서만 동작 (보안 강화)
      sameSite: 'strict', // CSRF 방지
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 유지
    });
  }

  /**
   * refresh token 삭제
   */
  static clearRefreshToken(res: Response): void {
    res.clearCookie('refreshToken');
  }

  /**
   * refresh token 조회
   */
  static getRefreshToken(req: Request): string {
    return req.cookies['refreshToken'];
  }
}
