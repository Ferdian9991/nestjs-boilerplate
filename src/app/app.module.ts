import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { modules } from '@/modules';
import { authProviders } from '@/modules/gate/auth/auth.providers';
import { JwtModule } from '@nestjs/jwt';
import { usersProviders } from '@/modules/gate/users/users.providers';

@Module({
  imports: [
    ...modules,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [...usersProviders, ...authProviders, AppService],
})
export class AppModule {}
