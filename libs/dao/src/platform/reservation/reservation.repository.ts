import { Reservation } from '@libs/dao/platform/reservation/reservation.entity';
import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';

@EntityRepository(Reservation)
export class ReservationRepository extends AbstractRepository<Reservation> {}
