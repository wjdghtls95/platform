import { ClassConstructor } from 'class-transformer';
import { BaseDto } from '@libs/common/domain/dto/base.dto';

export class BaseOutDto extends BaseDto {
  static of<T>(this: ClassConstructor<T>, partial?: Partial<T>): T {
    return Object.assign(new this(), partial);
  }
}
