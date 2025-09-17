import { DataSource } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRoleEntity } from './entities/user-roles.entity';

export const GATE_USER_REPOSITORY = 'GATE_USER_REPOSITORY';
export const GATE_USER_ROLE_REPOSITORY = 'GATE_USER_ROLES_REPOSITORY';

export const usersProviders = [
  {
    provide: GATE_USER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: GATE_USER_ROLE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserRoleEntity),
    inject: ['DATA_SOURCE'],
  },
];
