import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { RoleEntity } from './entities/role.entity';
import PaginationRequest, {
  PaginationRequestType,
} from '@/common/decorator/pagination-request.decorator';
import { PaginationResponseType } from '@/common/helper/query.helper';
import NumberId from '@/common/decorator/number-id.decorator';
import { RoleEnum } from './enums/role.enum';
import { AuthorizeRole } from '@/common/decorator/authorize-role.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Create a new role
   *
   * @param {CreateRoleDto} createRoleDto
   * @returns {Promise<RoleEntity>}
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ tags: ['Create Role'] })
  @ResponseMessage('Role created successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * Get all roles
   *
   * @param {PaginationRequestType} pagination
   * @returns {Promise<PaginationResponseType<RoleEntity>>}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['List Role'] })
  @ResponseMessage('Role list fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findAll(
    @PaginationRequest() pagination: PaginationRequestType,
  ): Promise<PaginationResponseType<RoleEntity>> {
    return this.rolesService.findAll(pagination);
  }

  /**
   * Get a role by id
   *
   * @param {number} id
   * @returns {Promise<RoleEntity>}
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Get Role'] })
  @ResponseMessage('Role fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findOne(@NumberId('id') id: string): Promise<RoleEntity> {
    return this.rolesService.findOne(+id);
  }

  /**
   * Update a role by id
   *
   * @param {number} id
   * @param {UpdateRoleDto} updateRoleDto
   * @returns {Promise<RoleEntity>}
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Update Role'] })
  @ResponseMessage('Role updated successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  update(
    @NumberId('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  /**
   * Delete a role by id
   *
   * @param {number} id
   * @returns {Promise<RoleEntity>}
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ tags: ['Delete Role'] })
  @ResponseMessage('Role deleted successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  remove(@NumberId('id') id: string): Promise<RoleEntity> {
    return this.rolesService.remove(+id);
  }
}
