import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, mergeMap, Observable } from 'rxjs';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      /**
       * exception
       */
      catchError(async (e) => {
        await TypeOrmHelper.rollbackTransactions();

        await TypeOrmHelper.releases();

        throw e;
      }),

      /**
       * execute
       */
      mergeMap(async (res) => {
        await TypeOrmHelper.commitTransactions();

        // await TypeOrmHelper.releases();

        return res;
      }),
    );
  }
}
