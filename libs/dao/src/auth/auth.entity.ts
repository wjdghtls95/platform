import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum AuthType {
  EMAIL = 'email',
  GOOGLE = 'google',
}

@Entity('auth')
export class Auth extends BaseTimeEntity {
  @Index()
  @Column()
  userId: number;

  @Column({ type: 'enum', enum: AuthType })
  authType: AuthType;

  @Column({ nullable: true }) // 이메일 로그인 시 사용
  passwordHash?: string;

  @Column({ nullable: true }) // 소셜 로그인 시 사용
  providerId?: string;
}
