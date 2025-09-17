import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { ReservationEvent } from '@libs/dao/platform/reservation/event/reservation-event.entity';

@EntityRepository(ReservationEvent)
export class ReservationEventRepository extends AbstractRepository<ReservationEvent> {}
