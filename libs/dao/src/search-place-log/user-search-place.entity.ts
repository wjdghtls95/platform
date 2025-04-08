// 3. 유저가 실제 검색한 장소 기록 엔티티
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('search_place')
export class SearchPlaceLog extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  golfCourseId: number; // 검색 기준이 된 골프장

  @Column()
  placeId: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ default: 1 })
  visitCount: number;

  @CreateDateColumn()
  searchedAt: Date;

  // @Column()
  // provider: 'kakao' | 'naver';
}
