import { DataSource } from 'typeorm';
import { RoleEntity } from './entities/role.entity';

export const GATE_ROLE_REPOSITORY = 'GATE_ROLE_REPOSITORY';

export const rolesProviders = [
  {
    provide: GATE_ROLE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoleEntity),
    inject: ['DATA_SOURCE'],
  },
];
