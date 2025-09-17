import { ReservationExternal } from '@libs/dao/platform/reservation/external/reservation-external.entity';
import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';

@EntityRepository(ReservationExternal)
export class ReservationExternalRepository extends AbstractRepository<ReservationExternal> {}
