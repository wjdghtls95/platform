import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';

@Entity('golf_courses')
export class GolfCourse extends AbstractEntity {
  @Column({ comment: '유저 아이디' })
  userId: number;

  @Column({ comment: '골프장 이름' })
  golfCourseName: string;

  @Column({ comment: '경도(longitude)' })
  lng: string;

  @Column({ comment: '위도(latitude)' })
  lat: string;

  @Column({ comment: '골프장 주소', nullable: true })
  address?: string;

  @Column({ comment: '골프장 전화번호', nullable: true })
  phone?: string;

  @Column({ comment: '골프장 웹 url', nullable: true })
  website?: string;
}
