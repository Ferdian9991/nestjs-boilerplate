import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import RouteHelper from '@/common/helper/route.helper';

const modules = [UsersModule, AuthModule];

@Module({
  imports: [...new RouteHelper('gate').register(...modules)],
  controllers: [],
  providers: [],
})
export class GateModule {}
