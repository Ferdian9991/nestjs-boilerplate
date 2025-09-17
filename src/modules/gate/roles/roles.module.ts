import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { rolesProviders } from './roles.providers';

@Module({
  controllers: [RolesController],
  providers: [...rolesProviders, RolesService],
})
export class RolesModule {}
