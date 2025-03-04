import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '@libs/dao/auth/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
  ) {}

  /**
   * 회원 등록
   */
  async register(): Promise<void> {
    return;
  }
}
