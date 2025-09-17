import { ApiProperty } from '@nestjs/swagger';

export class SwingAnalysisInDto {
  @ApiProperty({ description: '스윙 영상', type: 'file' })
  file: any;
}
