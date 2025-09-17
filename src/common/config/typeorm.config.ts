import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import ConfigHelper from '../helper/config.helper';
import { ModuleEntity } from '@/modules/module.entity';
import InitSeeder from '../database/seed.database';

config();

const options: DataSourceOptions & SeederOptions = {
  type: ConfigHelper.get('DATABASE_DRIVER', 'postgres'),
  host: ConfigHelper.get<string>('DATABASE_HOST', 'localhost'),
  port: ConfigHelper.get<number>('DATABASE_PORT', 5432),
  username: ConfigHelper.get<string>('DATABASE_USERNAME', null),
  password: ConfigHelper.get<string>('DATABASE_PASSWORD', null),
  database: ConfigHelper.get<string>('DATABASE_NAME', null),
  synchronize: false,
  entities: [...ModuleEntity],
  migrations: ['src/common/database/migrations/*_migration.ts'],
  seeds: [InitSeeder],
  migrationsRun: false,
  logging: true,
};

const AppDataSource = new DataSource(options);

export default AppDataSource;
