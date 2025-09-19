import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnrolledClassroom, EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import PaginationRequest, {
  PaginationRequestType,
} from '@/common/decorator/pagination-request.decorator';
import { PaginationResponseType } from '@/common/helper/query.helper';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { RoleEnum } from '@/modules/gate/roles/enums/role.enum';
import { AuthorizeRole } from '@/common/decorator/authorize-role.decorator';
import Auth, { AuthType } from '@/common/decorator/auth.decorator';
import { ClassroomEntity } from '../classrooms/entities/classroom.entity';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  /**
   * Create a new enrollment
   *
   * @param {CreateEnrollmentDto[]} createEnrollmentDto
   * @returns {Promise<EnrollmentEntity[]>}
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ tags: ['Create Enrollment'] })
  @ResponseMessage('Enrollment created successfully')
  @AuthorizeRole([RoleEnum.MAHASISWA])
  create(
    @Auth() auth: AuthType,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<ClassroomEntity> {
    return this.enrollmentsService.create(auth, createEnrollmentDto);
  }

  /**
   * Get all enrollments
   *
   * @param {PaginationRequestType} pagination
   * @returns {Promise<PaginationResponseType<EnrolledClassroom>>}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['List Enrollment'] })
  @ResponseMessage('Enrollment list fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findAll(
    @PaginationRequest() pagination: PaginationRequestType,
  ): Promise<PaginationResponseType<EnrolledClassroom>> {
    return this.enrollmentsService.findAll(pagination);
  }

  /**
   * Get an enrollment by id
   *
   * @param {number} id
   * @returns {Promise<EnrollmentEntity>}
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Get Enrollment'] })
  @ResponseMessage('Enrollment fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findOne(@Param('id') id: string): Promise<ClassroomEntity> {
    return this.enrollmentsService.findOne(+id);
  }

  /**
   * Delete an enrollment by id
   *
   * @param {number} id
   * @returns {Promise<ClassroomEntity>}
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ tags: ['Delete Enrollment'] })
  @ResponseMessage('Enrollment deleted successfully')
  @AuthorizeRole([RoleEnum.ADMIN, RoleEnum.MAHASISWA])
  remove(@Param('id') id: string): Promise<ClassroomEntity> {
    return this.enrollmentsService.remove(+id);
  }
}
