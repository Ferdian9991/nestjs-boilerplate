import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { usersProviders } from '../users/users.providers';

@Module({
  controllers: [AuthController],
  providers: [...usersProviders, AuthService],
})
export class AuthModule {}
