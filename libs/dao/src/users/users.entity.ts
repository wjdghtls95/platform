import { Column, Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';

@Entity('users')
export class Users extends BaseTimeEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
