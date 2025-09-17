import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { Column, Entity, Index } from 'typeorm';
import { AUTH_TYPE, AuthType } from '@libs/common/constants/auth.constants';

@Entity('auth')
export class Auth extends AbstractEntity {
  @Index({ unique: true })
  @Column({ comment: '유저 아이디' })
  userId: number;

  @Column({ comment: '로그인 이메일', unique: true })
  email: string;

  @Column({ comment: '비밀번호', nullable: true })
  password?: string;

  @Column({
    comment: '회원가입 타입',
    type: 'enum',
    enum: AUTH_TYPE,
    default: AUTH_TYPE.EMAIL,
  })
  authType: AuthType;

  @Column({ comment: '소셜 로그인 id', nullable: true }) // 소셜 로그인 시 사용
  providerId?: string;

  @Column({ comment: 'refresh token', nullable: true })
  refreshToken?: string;
}
