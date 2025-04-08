import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { Favorite } from '@libs/dao/favorite/favorite.entity';

@EntityRepository(Favorite)
export class FavoriteRepository extends AbstractRepository<Favorite> {}
