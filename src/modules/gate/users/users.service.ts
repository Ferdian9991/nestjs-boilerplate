import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import NotFound from '@/common/error/not-found.error';
import { PaginationRequestType } from '@/common/decorator/pagination-request.decorator';
import {
  PaginationResponseType,
  QueryHelper,
} from '@/common/helper/query.helper';
import { HashHelper } from '@/common/helper/hash.helper';
import Validation from '@/common/error/validation.error';
import { UserRoleEntity } from './entities/user-roles.entity';
import { RoleEntity } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Create a new user
   *
   * @param {CreateUserDto} createUserDto
   * @returns {Promise<UserEntity>}
   */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Check if username or email already exists
    await this.checkUsernameOrEmailExists(
      createUserDto.username,
      createUserDto.email,
    );

    const user = this.userRepository.create(createUserDto);

    user.password = await HashHelper.hash(createUserDto.password);

    return await this.userRepository.save(user);
  }

  /**
   * Find all users
   *
   * @param {PaginationRequestType} params
   * @returns {Promise<PaginationResponseType<UserEntity>>}
   */
  async findAll(
    params: PaginationRequestType,
  ): Promise<PaginationResponseType<UserEntity>> {
    const sql = `
      SELECT 
        u.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', r.id,
              'code', r.code,
              'name', r.name
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'::json
        ) AS roles
      FROM gate.users u
      JOIN gate.user_roles ur ON u.id = ur.user_id AND ur.deleted_at IS NULL
      JOIN gate.roles r ON ur.role_id = r.id AND r.deleted_at IS NULL
    `;
    const users = QueryHelper.paginateRawQuery(
      this.userRepository,
      sql,
      'u',
      params,
      ['fullname', 'email', 'deleted_at'],
      {
        groupBy: 'GROUP BY u.id',
      },
    );

    return users;
  }

  /**
   * Find one user by id
   *
   * @param {number} id
   * @returns {Promise<UserEntity>}
   */
  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFound(`User with id ${id} not found`);
    }

    user.roles = user.roles.map((role) => {
      const { id, code, name } = role;
      return { id, code, name } as RoleEntity;
    });

    return user;
  }

  /**
   * Update a user by id
   *
   * @param {number} id
   * @param {UpdateUserDto} updateUserDto
   * @returns {Promise<UserEntity>}
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFound(`User with id ${id} not found`);
    }

    // Exclude password when updating
    if (updateUserDto.password) {
      delete updateUserDto.password;
    }

    // Check if username or email already exists
    await this.checkUsernameOrEmailExists(
      updateUserDto.username,
      user.email,
      id,
    );

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  /**
   * Remove a user by id
   *
   * @param {number} id
   * @returns {Promise<UserEntity>}
   */
  async remove(id: number): Promise<UserEntity> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFound(`User with id ${id} not found`);
    }

    await this.userRepository.softDelete(user.id);

    return user;
  }

  /**
   * Check if username or email already exists
   *
   * @param {number} [id]
   * @param {string} username
   * @param {string} email
   * @returns {Promise<void>}
   * @throws {Error}
   */
  private async checkUsernameOrEmailExists(
    username: string,
    email: string,
    id?: number,
  ): Promise<void> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('(user.username = :username OR user.email = :email)', {
        username,
        email,
      });

    if (id) {
      query.andWhere('user.id != :id', { id });
    }

    const existingUser = await query.getOne();

    if (existingUser) {
      if (existingUser.username === username) {
        throw new Validation(
          JSON.stringify([
            { field: 'username', message: 'Username already exists' },
          ]),
        );
      }
      if (existingUser.email === email) {
        throw new Validation(
          JSON.stringify([{ field: 'email', message: 'Email already exists' }]),
        );
      }
    }
  }
}
