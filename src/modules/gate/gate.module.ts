import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import RouteHelper from '@/common/helper/route.helper';

const modules = [UsersModule];

@Module({
  imports: [...new RouteHelper('gate').register(...modules)],
  controllers: [],
  providers: [],
})
export class GateModule {}
