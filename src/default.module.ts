import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Connection from '@/common/database/connection.database';
import { AppModule } from './app/app.module';
import { UsersModule } from './modules/gate/users/users.module';
import { ModuleEntity } from './modules/module.entity';
import { DatabaseModule } from './common/database/database.module';

const databaseConnection = new Connection([...ModuleEntity]);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AppModule,
    UsersModule,
  ],
})
export class DefaultModule {}
