import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { ReservationStatus } from '@libs/common/constants/reservation-status.constants';

@Entity('reservation_events')
export class ReservationEvent extends AbstractEntity {
  @Column({ comment: '예약 fk' })
  reservationId: number;

  @Column({ comment: '예약 외부 fk' })
  reservationExternalId: number;

  @Column({ length: 64, comment: '예약 제공사이트' })
  provider!: string;

  @Column({ length: 64, comment: '예약 결과 타입' })
  eventType: ReservationStatus; // CREATED/CANCELLED/FAILED

  @Column({ length: 128, nullable: true })
  externalReservationId?: string | null;

  @Column({ nullable: true, comment: '멱등성 키(X-Event-Id)' })
  eventId?: string | null;

  @Column({ nullable: true, comment: '실패/취소 사유' })
  failureReason?: string | null;

  @Column({ type: 'json', nullable: true, comment: '원문 페이로드(디버깅)' })
  payload?: Record<string, unknown> | null;
}
