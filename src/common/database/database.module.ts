import { Global, Module } from '@nestjs/common';
import Connection from './connection.database';
import { ModuleEntity } from '@/modules/module.entity';

const databaseConnection = new Connection([...ModuleEntity]);

@Global()
@Module({
  providers: [...databaseConnection.getProviders()],
  exports: [...databaseConnection.getProviders()],
})
export class DatabaseModule {}
