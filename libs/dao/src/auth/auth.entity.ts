import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { Column, Entity, Index } from 'typeorm';
import { AUTH_TYPE, AuthType } from '@libs/common/constants/auth.constants';

@Entity('auth')
export class Auth extends AbstractEntity {
  @Index()
  @Column({ comment: '유저 아이디' })
  userId: number;

  @Column({
    comment: '회원가입 타입',
    type: 'enum',
    enum: AUTH_TYPE,
    default: AUTH_TYPE.EMAIL,
  })
  authType: AuthType;

  @Column({ comment: '소셜 로그인 id', nullable: true }) // 소셜 로그인 시 사용
  providerId?: string;
}
