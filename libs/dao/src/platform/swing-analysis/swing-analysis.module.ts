import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { SwingAnalysisRepository } from '@libs/dao/platform/swing-analysis/swing-analysis.repository';
import { HttpModule } from '@nestjs/axios';
import { SwingAnalysisProvider } from '@libs/common/external/swing-analysis/swing-analysis.provider';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [SwingAnalysisRepository],
      [DATABASE_NAME.SWING_ANALYSIS],
    ),
  ],
  providers: [SwingAnalysisProvider],
  exports: [TypeOrmExModule, SwingAnalysisProvider],
})
export class SwingAnalysisModule {}
