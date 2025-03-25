import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { AUTH_TYPE, AuthType } from '@libs/common/constants/auth.constants';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ comment: '유저 이름', nullable: true })
  name?: string;

  @Index({ unique: true })
  @Column({ comment: '유저 이메일' })
  email: string;

  @Column({ comment: '유저 비밀번호', nullable: true })
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
