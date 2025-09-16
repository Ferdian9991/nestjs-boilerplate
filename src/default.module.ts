import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { UsersModule } from './modules/gate/users/users.module';
import { DatabaseModule } from './common/database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    DatabaseModule,
    AppModule,
    UsersModule,
  ],
})
export class DefaultModule {}
