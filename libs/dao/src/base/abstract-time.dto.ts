import { AbstractDto } from '@libs/dao/base/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AbstractTimeDto extends AbstractDto {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
