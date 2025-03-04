import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseTimeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '아이디' })
  id: number;

  @CreateDateColumn({ comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '업데이트 시간' })
  updatedAt: Date;

  static create<T>(this: new () => T, partial?: Partial<T>): T {
    return Object.assign(new this(), partial);
  }
}
