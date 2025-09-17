import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';
import {
  RESERVATION_STATUS,
  ReservationStatus,
} from '@libs/common/constants/reservation-status.constants';

@Entity('reservations')
export class Reservation extends AbstractEntity {
  @Column({ comment: '예약한 유저 아이디' })
  userId: number;

  @Column({ comment: '예약한 골프장 아이디' })
  golfCourseId: number;

  @Column({ comment: '예약 시작 시간' })
  startAt: Date;

  @Column({ comment: '예약 종료 시간', nullable: true })
  endAt?: Date;

  @Column({ comment: '예약 인원', default: 1 })
  partySize: number;

  @Index({ unique: true })
  @Column({ comment: '예약 번호', nullable: true })
  reservationCode?: string;

  @Column({
    comment: '예약 상태',
    type: 'enum',
    enum: RESERVATION_STATUS,
    default: RESERVATION_STATUS.pending,
  })
  status: ReservationStatus;
}
