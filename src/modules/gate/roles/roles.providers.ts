import { DataSource } from 'typeorm';
import { RoleEntity } from './entities/role.entity';

export const rolesProviders = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoleEntity),
    inject: ['DATA_SOURCE'],
  },
];
