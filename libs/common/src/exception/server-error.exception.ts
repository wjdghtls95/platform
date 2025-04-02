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
      errorMessage || ServerErrorException.errorCodeToString(errorCode),
    );
    this.ignoreExceptionLog = ignoreExceptionLog;
  }

  /**
   * get error description
   */
  static errorCodeToString(errorCode: InternalErrorCode): string {
    const codeName = Object.keys(INTERNAL_ERROR_CODE).find(
      (key) => INTERNAL_ERROR_CODE[key] === errorCode,
    );

    return codeName || 'ERROR_CODE_UNKNOWN';
  }
}
