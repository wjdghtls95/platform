import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';

@Entity('users')
export class Users extends AbstractEntity {
  @Column({ comment: '유저 이름' })
  name: string;

  @Index({ unique: true })
  @Column({ comment: '유저 이메일' })
  email: string;

  @Column({ comment: '유저 비밀번호' })
  password: string;

  @Column({ comment: 'jwt refresh token', nullable: true })
  refreshToken?: string;
}
