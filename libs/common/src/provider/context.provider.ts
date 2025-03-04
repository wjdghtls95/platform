import { ClsServiceManager } from 'nestjs-cls';

// test debugging 용
export const context = {};

export class ContextProvider {
  static get<T>(key: string): T {
    return process.env.NODE_ENV === 'test'
      ? context[key]
      : ClsServiceManager.getClsService().get(key);
  }

  static set<T>(key: string, value: T): void {
    process.env.NODE_ENV === 'test'
      ? (context[key] = value)
      : ClsServiceManager.getClsService().set(key, value);
  }
}
