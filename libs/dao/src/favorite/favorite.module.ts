import { Module } from '@nestjs/common';
import { FavoriteRepository } from '@libs/dao/favorite/favorite.repository';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forFeatures([FavoriteRepository], [DATABASE_NAME.FAVORITE]),
  ],
  exports: [TypeOrmExModule],
})
export class FavoriteModule {}
