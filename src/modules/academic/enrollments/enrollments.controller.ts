import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnrolledClassroom, EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import PaginationRequest, {
  PaginationRequestType,
} from '@/common/decorator/pagination-request.decorator';
import { PaginationResponseType } from '@/common/helper/query.helper';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { RoleEnum } from '@/modules/gate/roles/enums/role.enum';
import { AuthorizeRole } from '@/common/decorator/authorize-role.decorator';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  /**
   * Get all enrollments
   *
   * @param {PaginationRequestType} pagination
   * @returns {Promise<PaginationResponseType<EnrolledClassroom>>}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['List Enrollments'] })
  @ResponseMessage('Enrollments list fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findAll(
    @PaginationRequest() pagination: PaginationRequestType,
  ): Promise<PaginationResponseType<EnrolledClassroom>> {
    return this.enrollmentsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }
}
