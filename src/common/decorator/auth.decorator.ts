import { UserEntity } from '@/modules/gate/users/entities/user.entity';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import Unauthorized from '../error/unauthorized.error';

export type AuthType = UserEntity;

/**
 * Client ID Decorator
 *
 * @param {Object} data
 * @param {ExecutionContext} ctx
 */
const Auth = createParamDecorator(
  (data: string, ctx: ExecutionContext): AuthType => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.user) {
      throw new Unauthorized('User not authenticated');
    }

    return req.user;
  },
);

export default Auth;
