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
    const filter: Record<string, any> = {};
    const sort: Record<string, any> = {};
    const pagination = {
      page: 1,
      limit: 10,
    };

    for (const [key, rawValue] of Object.entries(request.query)) {
      const value = rawValue as string;

      // Filter skip null/empty values
      if (key.startsWith('filter_')) {
        const field = key.replace('filter_', '').trim();
        if (
          field.length > 0 &&
          value !== undefined &&
          value !== null &&
          value !== '' &&
          value.toLowerCase() !== 'null'
        ) {
          filter[field] = value;
        }
      }

      // Sort
      if (key.startsWith('sort_')) {
        const field = key.replace('sort_', '').trim();
        if (field.length > 0) {
          sort[field] = value === 'desc' ? 1 : -1;
        }
      }

      // Pagination
      if (key === 'page') {
        const page = parseInt(value);
        pagination.page = page > 0 ? page : 1;
      }

      if (key === 'limit') {
        const limit = parseInt(value);
        pagination.limit = limit > 0 ? limit : 10;
      }

      // Search
      if (key === 'search') {
        if (value && value.toLowerCase() !== 'null') {
          search = value;
        }
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
