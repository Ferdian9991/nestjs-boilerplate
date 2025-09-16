import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import BadRequest from '../error/bad-request.error';

export type NumberIdType = string;

/**
 * Object ID Decorator
 *
 * @param {Object} data
 * @param {ExecutionContext} ctx
 */
const NumberId = createParamDecorator<NumberIdType>(
  (data: string, ctx: ExecutionContext): NumberIdType => {
    const { params } = ctx.switchToHttp().getRequest();
    const id = params[data];

    if (!id || isNaN(Number(id))) {
      throw new BadRequest(`Invalid ID: ${id}`);
    }

    return id;
  },
);

export default NumberId;
