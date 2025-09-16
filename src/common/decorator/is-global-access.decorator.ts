import { SetMetadata } from '@nestjs/common';

export const IsGlobalAccess = () => SetMetadata('is_global_access', true);
