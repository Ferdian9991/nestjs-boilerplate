import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import ConfigHelper from '../helper/config.helper';
import { DynamicModule } from '@nestjs/common';
import {
  DataSource,
  DataSourceOptions,
  EntitySchema,
  MixedList,
} from 'typeorm';

/**
 * Define the configuration type
 * @type {DatabaseConfigType}
 */
export type DatabaseConfigType = TypeOrmModuleOptions;

/**
 * Database Connection Class
 * @class Connection
 */
export default class Connection {
  /**
   * Constructor
   *
   * @param {MixedList<string | Function | EntitySchema<any>>} entities - The entities to be used in the database connection
   */
  constructor(
    protected entities: MixedList<string | Function | EntitySchema<any>>,
  ) {}

  public getProviders() {
    return [
      {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
          const dataSource = new DataSource(
            this.getConfig() as DataSourceOptions,
          );

          return dataSource.initialize();
        },
      },
    ];
  }

  /**
   * Get the database connection module
   *
   * @returns {DynamicModule}
   */
  public getConnection(): DynamicModule {
    return TypeOrmModule.forRoot(this.getConfig());
  }

  /**
   * Get the database connection module
   *
   * @returns {TypeOrmModule}
   */
  private getConfig(): DatabaseConfigType {
    return {
      type: ConfigHelper.get('DATABASE_DRIVER', 'postgres'),
      host: ConfigHelper.get<string>('DATABASE_HOST', 'localhost'),
      port: ConfigHelper.get<number>('DATABASE_PORT', 5432),
      username: ConfigHelper.get<string>('DATABASE_USERNAME', null),
      password: ConfigHelper.get<string>('DATABASE_PASSWORD', null),
      database: ConfigHelper.get<string>('DATABASE_NAME', null),
      entities: this.entities,
      synchronize: false,
    };
  }
}
