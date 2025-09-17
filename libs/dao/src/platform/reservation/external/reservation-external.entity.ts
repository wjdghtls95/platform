import { Column, Entity, Unique } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';

@Entity('reservation_external')
@Unique('uq_provider_external', ['provider', 'externalReservationId'])
export class ReservationExternal extends AbstractEntity {
  @Column({ comment: '예약 아이디' })
  reservationId: number;

  @Column({ comment: '예약 출처 (ex. naver, kakao ...)' })
  provider: string;

  @Column({ comment: '외부 예약 출처의 예약 아이디', nullable: true })
  externalReservationId: string;

  @Column({
    comment: '외부 검증 여부 (웹훅/제휴 확인)',
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  @Column({ comment: '외부 검증 시각', type: 'datetime', nullable: true })
  verifiedAt?: Date;
}
