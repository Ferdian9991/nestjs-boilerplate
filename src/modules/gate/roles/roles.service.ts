import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import {
  PaginationResponseType,
  QueryHelper,
} from '@/common/helper/query.helper';
import { PaginationRequestType } from '@/common/decorator/pagination-request.decorator';
import NotFound from '@/common/error/not-found.error';
import Validation from '@/common/error/validation.error';
import { GATE_ROLE_REPOSITORY } from './roles.providers';

@Injectable()
export class RolesService {
  constructor(
    @Inject(GATE_ROLE_REPOSITORY)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  /**
   * Create a new role
   *
   * @param {CreateRoleDto} createRoleDto
   * @returns {Promise<RoleEntity>}
   */
  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = this.roleRepository.create(createRoleDto);

    // Check if role code already exists
    await this.checkRoleCodeExists(createRoleDto.code);

    return await this.roleRepository.save(role);
  }

  /**
   * Find all roles
   *
   * @param {PaginationRequestType} params
   * @returns {Promise<PaginationResponseType<RoleEntity>>}
   */
  findAll(
    params: PaginationRequestType,
  ): Promise<PaginationResponseType<RoleEntity>> {
    return QueryHelper.paginate({
      repo: this.roleRepository,
      alias: 'role',
      params,
      searchFields: ['code', 'name'],
    });
  }

  /**
   * Find one role by id
   *
   * @param {number} id
   * @returns {Promise<RoleEntity>}
   */
  async findOne(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFound(`Role with id ${id} not found`);
    }

    return role;
  }

  /**
   * Update a role by id
   *
   * @param {number} id
   * @param {UpdateRoleDto} updateRoleDto
   * @returns {Promise<RoleEntity>}
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOne(id);

    if (!role) {
      throw new NotFound(`Role with id ${id} not found`);
    }

    // Check if role code already exists
    await this.checkRoleCodeExists(updateRoleDto.code, id);

    Object.assign(role, updateRoleDto);

    return await this.roleRepository.save(role);
  }

  /**
   * Remove a role by id
   *
   * @param {number} id
   * @returns {Promise<RoleEntity>}
   */
  async remove(id: number): Promise<RoleEntity> {
    const role = await this.findOne(id);

    if (!role) {
      throw new NotFound(`Role with id ${id} not found`);
    }

    return await this.roleRepository.softRemove(role);
  }

  /**
   * Check if role code already exists
   *
   * @param {string} code
   * @param {number} [id]
   * @returns {Promise<void>}
   * @throws {Validation} If role code already exists
   */
  private async checkRoleCodeExists(code: string, id?: number): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { code } });

    if (role && role.id !== id) {
      throw new Validation(
        JSON.stringify([
          { field: 'code', message: 'Role code already exists' },
        ]),
      );
    }
  }
}
