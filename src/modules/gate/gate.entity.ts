import { RoleEntity } from './roles/entities/role.entity';
import { UserRoleEntity } from './users/entities/user-roles.entity';
import { UserEntity } from './users/entities/user.entity';

export const GateEntity = [UserEntity, RoleEntity, UserRoleEntity];
