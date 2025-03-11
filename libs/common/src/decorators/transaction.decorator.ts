import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { DataSource } from 'typeorm';

/**
 * Transaction 데코레이터
 */
export function Transactional(...databaseNames: string[]): MethodDecorator {
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originMethod = descriptor.value;

    descriptor.value = async function (
      ...originMethodArgs: any[]
    ): Promise<PropertyDescriptor> {
      // console.log('[Transactional] 실행 시작');

      // 현재 실행 중인 인스턴스  this 에서 데이터베이스 정보 자동 감지
      const detectedDataSources = [];
      for (const key in this) {
        if (this[key]?.manager?.connection instanceof DataSource) {
          detectedDataSources.push(this[key].manager.connection.name);
        }
      }

      if (detectedDataSources.length === 0) {
        return await originMethod.apply(this, originMethodArgs);
      }

      await TypeOrmHelper.Transactional(detectedDataSources);

      return await originMethod.apply(this, originMethodArgs);
    };

    return descriptor;
  };
}
