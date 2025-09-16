import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export type PaginationRequestType = {
  search: string | null;
  filter: Record<string, any>;
  sort: Record<string, any>;
  pagination: {
    page: number;
    limit: number;
  };
};

/**
 * Pagination Request Decorator
 *
 * @param {Object} data
 * @param {ExecutionContext} ctx
 */
const PaginationRequest = createParamDecorator<PaginationRequestType>(
  (data: object, ctx: ExecutionContext): PaginationRequestType => {
    const request = ctx.switchToHttp().getRequest();
    let search: string | null = null;
    const filter = {};
    const sort = {};
    const pagination = {
      page: 1,
      limit: 10,
    };

    for (const [key, value] of Object.entries(request.query)) {
      if (key.includes('filter_') && key.replace('filter_', '').length > 0) {
        filter[key.replace('filter_', '')] = value;
      }

      if (key.includes('sort_') && key.replace('sort_', '').length > 0) {
        sort[key.replace('sort_', '')] = value === 'asc' ? 1 : -1;
      }

      if (key === 'page') {
        const page = parseInt(value as string);
        pagination.page = page > 0 ? page : 1;
      }

      if (key === 'limit') {
        const limit = parseInt(value as string);
        pagination.limit = limit > 0 ? limit : 10;
      }

      if (key === 'search') {
        search = value as string;
      }
    }

    return {
      search,
      filter,
      sort,
      pagination,
    };
  },
);

export default PaginationRequest;
