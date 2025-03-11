import { Exclude } from 'class-transformer';
import { AbstractDto } from '@libs/dao/base/abstract.dto';

export class ExcludeAbstractTimeDto extends AbstractDto {
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
