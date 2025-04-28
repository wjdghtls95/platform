import { Auth } from '@libs/common/decorators/auth.decorator';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwingAnalysisService } from './swing-analysis.service';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { CurrentUser } from '@libs/common/decorators/current-user.decorator';
import { AuthPayload } from '@libs/dao/auth/interfaces/auth-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { SwingAnalysisOutDto } from '@libs/dao/swing-analysis/dto/swing-analysis-out.dto';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { ApiFileUpload } from '@libs/common/decorators/api-file-upload.decorator';

@Controller('swing-analysis')
@ApiTags('Swing Analysis')
@Auth()
export class SwingAnalysisController {
  constructor(private readonly swingAnalysisService: SwingAnalysisService) {}

  @Post('/direct')
  @ApiResponseEntity({
    summary: '스윙 영상 로컬 업로드',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiFileUpload('file')
  async analyzeDirect(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthPayload,
  ): Promise<ResponseEntity<SwingAnalysisOutDto>> {
    const swingAnalysisOutDto =
      await this.swingAnalysisService.uploadLocalSwingFile(file, user.userId);

    return ResponseEntity.ok().body(swingAnalysisOutDto);
  }
}
