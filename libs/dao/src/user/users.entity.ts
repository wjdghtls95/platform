import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { AUTH_TYPE, AuthType } from '@libs/common/constants/auth.constants';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ comment: '유저 이름', nullable: true })
  name?: string;

  @Column({ comment: '닉네임', nullable: true })
  nickname?: string;
}
