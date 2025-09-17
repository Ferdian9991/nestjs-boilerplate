import { DataSource } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRoleEntity } from './entities/user-roles.entity';

export const usersProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USER_ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserRoleEntity),
    inject: ['DATA_SOURCE'],
  },
];
