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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { UserEntity } from './entities/user.entity';
import NumberId from '@/common/decorator/number-id.decorator';
import PaginationRequest, {
  PaginationRequestType,
} from '@/common/decorator/pagination-request.decorator';
import { PaginationResponseType } from '@/common/helper/query.helper';
import { IsGlobalAccess } from '@/common/decorator/is-global-access.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   *
   * @param {CreateUserDto} createUserDto
   * @returns {Promise<UserEntity>}
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ tags: ['Create User'] })
  @ResponseMessage('User created successfully')
  @IsGlobalAccess()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Get all users
   *
   * @returns {Promise<UserEntity[]>}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['List User'] })
  @ResponseMessage('User list fetched successfully')
  findAll(
    @PaginationRequest() pagination: PaginationRequestType,
  ): Promise<PaginationResponseType<UserEntity>> {
    return this.usersService.findAll(pagination);
  }

  /**
   * Get a user by id
   *
   * @param {number} id
   * @returns {Promise<UserEntity>}
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Get User'] })
  @ResponseMessage('User fetched successfully')
  findOne(@NumberId('id') id: number): Promise<UserEntity> {
    return this.usersService.findOne(+id);
  }

  /**
   * Update a user by id
   *
   * @param {number} id
   * @param {UpdateUserDto} updateUserDto
   * @returns {Promise<UserEntity>}
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Update User'] })
  @ResponseMessage('User updated successfully')
  update(
    @NumberId('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(+id, updateUserDto);
  }

  /**
   * Delete a user by id
   *
   * @param {number} id
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ tags: ['Delete User'] })
  @ResponseMessage('User deleted successfully')
  remove(@NumberId('id') id: number): Promise<UserEntity> {
    return this.usersService.remove(+id);
  }
}
