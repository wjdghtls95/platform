import {
  getDataSourceToken,
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DynamicModule, Provider } from '@nestjs/common';
import { TYPEORM_ENTITY_REPOSITORY } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { DataSource, ObjectType } from 'typeorm';

const customDataSources: Record<string, DataSource> = {};
const customRepositories: Record<string, Record<string, any>> = {};

export class TypeOrmExModule {
  public static forRoot(options?: TypeOrmModuleOptions): DynamicModule {
    return TypeOrmModule.forRoot(options);
  }

  public static forRootAsync(
    options: TypeOrmModuleAsyncOptions,
  ): DynamicModule {
    return TypeOrmModule.forRootAsync(options);
  }

  public static forFeatures<T extends new (...args: any[]) => any>(
    repositories: T[],
    dataSourceNames?: string[],
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(TYPEORM_ENTITY_REPOSITORY, repository);

      if (!entity) {
        continue;
      }

      const provider = {
        inject: dataSourceNames?.map((name) => getDataSourceToken(name)),
        provide: repository,
        useFactory: (
          ...dataSources: DataSource[]
        ): Record<string, typeof repository> | typeof repository => {
          const result: Record<string, typeof repository> = {};

          for (const dataSource of dataSources) {
            const database = dataSource.options.name as string;

            if (!customDataSources[database]) {
              customDataSources[database] = dataSource;
            }

            const baseRepo = dataSource.getRepository(entity);

            const customRepository = new repository(
              baseRepo.target,
              baseRepo.manager,
              baseRepo.queryRunner,
            );

            if (!customRepositories[database]) {
              customRepositories[database] = {};
            }
            customRepositories[database][repository.name] = customRepository;

            result[database] = customRepository;
          }

          const values = Object.values(result);
          return values.length === 1 ? values[0] : result;
        },
      };

      providers.push(provider);
    }

    return {
      providers: providers,
      exports: providers,
      module: TypeOrmExModule,
    };
  }
}

export function getCustomRepository<T>(
  repository: ObjectType<T>,
  dataSourceName: string,
): T {
  const repositoryDataSource = customRepositories[dataSourceName];

  if (repositoryDataSource && repositoryDataSource[repository.name]) {
    return repositoryDataSource[repository.name];
  }

  return null;
}

export function getDataSource(dataSourceName: string): DataSource | null {
  return customDataSources[dataSourceName] || null;
}
