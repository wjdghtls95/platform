import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';

@Entity('golf-courses')
export class GolfCourse extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  courseName: string;

  @Column()
  lat: number;

  @Column()
  lng: number;
}
