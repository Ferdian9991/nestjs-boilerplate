import { groupBy } from 'rxjs';
import { Repository, SelectQueryBuilder } from 'typeorm';

export interface PaginationRequestType {
  search?: string;
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface PaginationResponseType<T> {
  docs: T[];
  total: number;
  page: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface RawQueryBuilder {
  sql: string;
  queryParams: Record<string, number | string | boolean>;
  page: number;
  limit: number;
}

/**
 * Query Helper
 * @class QueryHelper
 */
export class QueryHelper {
  /**
   * Build a TypeORM query with search, filter, sort, and pagination
   *
   * @param {Repository<T>} repo
   * @param {string} alias
   * @param {PaginationRequestType} params
   * @param {(keyof T)[]} searchFields
   * @returns {SelectQueryBuilder<T>}
   */
  public static buildQuery<T>(
    repo: Repository<T>,
    alias: string,
    params: PaginationRequestType,
    searchFields: (keyof T)[] = [],
  ): SelectQueryBuilder<T> {
    const { search, filter, sort, pagination } = params;
    const queryBuilder = repo.createQueryBuilder(alias);

    // Get valid columns from entity metadata
    const validColumns = this.getEntityColumns(repo);

    if (search && searchFields.length > 0) {
      const safeSearchFields = searchFields.filter((f) =>
        validColumns.includes(f as string),
      );

      if (safeSearchFields.length > 0) {
        const searchConditions = safeSearchFields
          .map((field) => `"${alias}"."${String(field)}" ILIKE :search`)
          .join(' OR ');
        queryBuilder.andWhere(`(${searchConditions})`, {
          search: `%${search}%`,
        });
      }
    }

    // Filters
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (validColumns.includes(key)) {
          queryBuilder.andWhere(`"${alias}"."${key}" = :${key}`, {
            [key]: value,
          });
        }
      });
    }

    // Sorting
    if (sort) {
      Object.entries(sort).forEach(([key, direction]) => {
        if (validColumns.includes(key)) {
          queryBuilder.addOrderBy(
            `"${alias}"."${key}"`,
            direction === -1 ? 'DESC' : 'ASC',
          );
        }
      });
    }

    // Pagination
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    queryBuilder.skip((page - 1) * limit).take(limit);

    return queryBuilder;
  }

  /**
   * Paginate a TypeORM query
   *
   * @param {Repository<T>} repo
   * @param {string} alias
   * @param {PaginationRequestType} params
   * @param {(keyof T)[]} searchFields
   * @returns {Promise<PaginationResponseType<T>>}
   */
  public static async paginate<T>(
    repo: Repository<T>,
    alias: string,
    params: PaginationRequestType,
    searchFields: (keyof T)[] = [],
  ): Promise<PaginationResponseType<T>> {
    const queryBuilder = this.buildQuery(repo, alias, params, searchFields);
    const [docs, total] = await queryBuilder.getManyAndCount();
    const page = params.pagination?.page ?? 1;
    const limit = params.pagination?.limit ?? 10;

    const hasPrevPage = page > 1;
    const hasNextPage = page * limit < total;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    return {
      docs,
      total,
      page,
      limit,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
    };
  }

  /**
   * Build raw SQL with search, filter, sort, pagination
   *
   * @param {string} baseQuery
   * @param {string} alias
   * @param {PaginationRequestType} params
   * @param {string[]} searchFields
   * @param statements
   * @param statements.groupBy - Column to group by
   * @returns {{ sql: string; parameters: any[] }}
   */
  static buildRawQuery<T>(
    repo: Repository<T>,
    baseQuery: string,
    alias: string,
    params: PaginationRequestType,
    searchFields: string[] = [],
    statements = {
      groupBy: '',
    },
  ): { sql: string; parameters: any[] } {
    const { search, filter, sort, pagination } = params;
    let sql = baseQuery;
    const conditions: string[] = [];
    const parameters: any[] = [];

    // keep track of $ placeholders
    let paramIndex = 1;

    // Get valid columns from entity metadata
    const validColumns = this.getEntityColumns(repo);

    // Add filter in last where deleted_at IS NULL
    if (validColumns.includes('deleted_at')) {
      conditions.push(`${alias}.deleted_at IS NULL`);
      const index = validColumns.indexOf('deleted_at');
      if (index > -1) {
        validColumns.splice(index, 1);
      }
    }

    // Search
    if (search && searchFields.length > 0) {
      const safeSearchFields = searchFields.filter((f) =>
        validColumns.includes(f) && f !== 'deleted_at',
      );

      if (safeSearchFields.length > 0) {
        const searchConditions = safeSearchFields
          .map((field) => `${alias}.${field} ILIKE $${paramIndex++}`)
          .join(' OR ');
        conditions.push(`(${searchConditions})`);
        parameters.push(...safeSearchFields.map(() => `%${search}%`));
      }
    }

    // Filter
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (validColumns.includes(key) && key !== 'deleted_at') {
          conditions.push(`${alias}.${key} = $${paramIndex++}`);
          parameters.push(value);
        }
      });
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Group By
    if (statements.groupBy.length > 0) {
      sql += ` ${statements.groupBy}`;
    }

    // Sort
    if (sort) {
      const orderBys = Object.entries(sort)
        .filter(([key]) => validColumns.includes(key))
        .map(
          ([key, direction]) =>
            `${alias}.${key} ${direction === -1 ? 'DESC' : 'ASC'}`,
        );
      if (orderBys.length > 0) {
        sql += ` ORDER BY ${orderBys.join(', ')}`;
      }
    }

    // Pagination
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const offset = (page - 1) * limit;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    return { sql, parameters };
  }

  /**
   * Paginate a raw SQL query
   *
   * @param {Repository<T>} repo
   * @param {string} baseQuery
   * @param {string} alias
   * @param {PaginationRequestType} params
   * @param {string[]} searchFields
   * @returns {Promise<PaginationResponseType<T>>}
   */
  static async paginateRawQuery<T>(
    repo: Repository<T>,
    baseQuery: string,
    alias: string,
    params: PaginationRequestType,
    searchFields: string[] = [],
    statements = {
      groupBy: '',
    },
  ): Promise<PaginationResponseType<T>> {
    const { sql, parameters } = this.buildRawQuery(
      repo,
      baseQuery,
      alias,
      params,
      searchFields,
      statements,
    );

    const docs = await repo.query(sql, parameters);

    // Count query (without LIMIT/OFFSET)
    let countSql = sql
      // remove ORDER BY and everything after
      .replace(/ORDER BY[\s\S]*$/i, '')
      // remove pagination
      .replace(/LIMIT \d+ OFFSET \d+/i, '');

    const countResult = await repo.query(
      `SELECT COUNT(*) as total FROM (${countSql}) AS subquery`,
      parameters,
    );

    const total = parseInt(countResult[0]?.total ?? 0, 10);
    const page = params.pagination?.page ?? 1;
    const limit = params.pagination?.limit ?? 10;

    const hasPrevPage = page > 1;
    const hasNextPage = page * limit < total;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    return {
      docs,
      total,
      page,
      limit,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
    };
  }

  /**
   * Get valid column names from repository metadata
   *
   * @param {Repository<T>} repo
   * @returns {string[]}
   */
  private static getEntityColumns<T>(repo: Repository<T>): string[] {
    return repo.metadata.columns.map((col) => col.propertyName);
  }
}
