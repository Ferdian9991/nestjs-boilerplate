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
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { AuthorizeRole } from '@/common/decorator/authorize-role.decorator';
import { RoleEnum } from '@/modules/gate/roles/enums/role.enum';
import { ClassroomEntity } from './entities/classroom.entity';
import PaginationRequest, {
  PaginationRequestType,
} from '@/common/decorator/pagination-request.decorator';
import { PaginationResponseType } from '@/common/helper/query.helper';
import NumberId from '@/common/decorator/number-id.decorator';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  /**
   * Create a new classroom
   *
   * @param {CreateClassroomDto} createClassroomDto
   * @returns {Promise<ClassroomEntity>}
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ tags: ['Create Classroom'] })
  @ResponseMessage('Classroom created successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  create(
    @Body() createClassroomDto: CreateClassroomDto,
  ): Promise<ClassroomEntity> {
    return this.classroomsService.create(createClassroomDto);
  }

  /**
   * Get all classrooms
   *
   * @param {PaginationRequestType} pagination
   * @returns {Promise<PaginationResponseType<ClassroomEntity>>}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['List Classroom'] })
  @ResponseMessage('Classroom list fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findAll(
    @PaginationRequest() pagination: PaginationRequestType,
  ): Promise<PaginationResponseType<ClassroomEntity>> {
    return this.classroomsService.findAll(pagination);
  }

  /**
   * Get a classroom by id
   *
   * @param {number} id
   * @returns {Promise<ClassroomEntity>}
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Get Classroom'] })
  @ResponseMessage('Classroom fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findOne(@NumberId('id') id: string): Promise<ClassroomEntity> {
    return this.classroomsService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Update Classroom'] })
  @ResponseMessage('Classroom updated successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  update(
    @NumberId('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomsService.update(+id, updateClassroomDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ tags: ['Delete Classroom'] })
  @ResponseMessage('Classroom deleted successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  remove(@NumberId('id') id: string) {
    return this.classroomsService.remove(+id);
  }
}
