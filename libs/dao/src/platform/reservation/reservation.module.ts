import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { ReservationExternalRepository } from '@libs/dao/platform/reservation/external/reservation-external.respository';
import { ReservationRepository } from '@libs/dao/platform/reservation/reservation.repository';
import { ReservationEvent } from '@libs/dao/platform/reservation/event/reservation-event.entity';
import { Module } from '@nestjs/common';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [ReservationRepository, ReservationExternalRepository, ReservationEvent],
      [DATABASE_NAME.RESERVATION],
    ),
  ],
  exports: [TypeOrmExModule],
})
export class ReservationModule {}
