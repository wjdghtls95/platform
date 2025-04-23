import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { SwingAnalysisRepository } from '@libs/dao/swing-analysis/swing-analysis.repository';
import { SwingAnalysisProvider } from '@libs/common/external/swing-analysis/swing-analysis.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),

    TypeOrmExModule.forFeatures(
      [SwingAnalysisRepository],
      [DATABASE_NAME.SWING_ANALYSIS],
    ),
  ],
  providers: [SwingAnalysisProvider],
  exports: [TypeOrmExModule, SwingAnalysisProvider],
})
export class SwingAnalysisModule {}
