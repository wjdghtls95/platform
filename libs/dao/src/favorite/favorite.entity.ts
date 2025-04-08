import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { Column, Entity } from 'typeorm';

// 유저 즐겨찾기 엔티티 (골프장 기준)
@Entity('favorite')
export class Favorite extends AbstractEntity {
  @Column({ comment: '유저 아이디' })
  userId: number;

  @Column({ comment: '골프장 아이디' })
  golfCourseId: number;

  @Column({ comment: '외부 API 장소 아이디' })
  placeId: string;

  @Column({ comment: '장소 이름' })
  name: string;

  @Column({ comment: '장소 카테고리' })
  category: string;

  /**
   * TODO.. 다른 open api 로 검색시 provider 주석 해제
   */
  // @Column()
  // provider: 'kakao' | 'naver';
}
