import { InternalServerErrorException } from '@nestjs/common';
import {
  InternalErrorCode,
  INTERNAL_ERROR_CODE,
} from '@libs/common/constants/internal-error-code.constants';

export class ServerErrorException extends InternalServerErrorException {
  public readonly ignoreExceptionLog: boolean;

  constructor(
    errorCode: InternalErrorCode,
    errorMessage?: string,
    ignoreExceptionLog = false,
  ) {
    super(
      errorCode,
      errorMessage || ServerErrorException.getErrorDescription(errorCode),
    );
    this.ignoreExceptionLog = ignoreExceptionLog;
  }

  /**
   * get error description
   */
  static getErrorDescription(errorCode: InternalErrorCode): string {
    const codeName = Object.keys(INTERNAL_ERROR_CODE).find(
      (key) => INTERNAL_ERROR_CODE[key] === errorCode,
    );

    return codeName || 'ERROR_CODE_UNKNOWN';
  }
}
