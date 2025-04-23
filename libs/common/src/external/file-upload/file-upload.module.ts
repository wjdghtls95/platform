import { DynamicModule, Module } from '@nestjs/common';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { FileUploadHelper } from './file-upload.helper';

@Module({})
export class FileUploadModule {
  static forRoot(): DynamicModule {
    const multerOptions: MulterModuleOptions = {
      storage: FileUploadHelper.storage(),
      fileFilter: FileUploadHelper.fileFilter,
    };

    return {
      module: FileUploadModule,
      imports: [MulterModule.register(multerOptions)],
    };
  }
}
