import { InternalServerErrorException } from '@nestjs/common';
import {
  InternalErrorCode,
  INTERNAL_ERROR_CODE,
} from '@libs/common/constants/internal-error-code.constants';
import { INTERNAL_ERROR_CODE_DESC } from '@libs/common/constants/internal-error-code-desc.constants';

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
    let codeName = Object.keys(INTERNAL_ERROR_CODE).find(
      (key) => INTERNAL_ERROR_CODE[key] === errorCode,
    );

    if (process.env.NODE_ENV !== 'prod') {
      codeName += ` (${INTERNAL_ERROR_CODE_DESC[errorCode]})`;
    }

    return codeName || 'ERROR_CODE_UNKNOWN';
  }
}
