import { RoleEnum } from '@/modules/gate/roles/enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const AuthorizeRole = (roleCode: RoleEnum[]) =>
  SetMetadata('authorize_role', roleCode);
