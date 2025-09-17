import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

export class FileUploadHelper {
  static uploadDir = './uploads';

  /**
   * 업로드 폴더가 없으면 생성
   */
  static ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * 디스크 스토리지 설정 반환
   */
  static storage() {
    this.ensureUploadDir();

    return diskStorage({
      destination: this.uploadDir,
      filename: (req, file, cb) => {
        // const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    });
  }

  /**
   * 확장자 필터링 로직 (허용된 확장자 외 reject)
   */
  static fileFilter(req: any, file: any, cb: any) {
    const ext = path.extname(file.originalname).toLowerCase();
    // 허용된 확장자 리스트
    if (!['.mp4'].includes(ext)) {
      return cb(
        new ServerErrorException(
          INTERNAL_ERROR_CODE.FILE_UPLOAD_UNSUPPORTED_MEDIA_TYPE,
        ),
        false,
      );
    }
    cb(null, true);
  }
}
