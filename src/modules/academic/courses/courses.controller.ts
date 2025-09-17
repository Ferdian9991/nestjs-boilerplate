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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { AuthorizeRole } from '@/common/decorator/authorize-role.decorator';
import { RoleEnum } from '@/modules/gate/roles/enums/role.enum';
import { CourseEntity } from './entities/course.entity';
import PaginationRequest, {
  PaginationRequestType,
} from '@/common/decorator/pagination-request.decorator';
import { PaginationResponseType } from '@/common/helper/query.helper';
import NumberId from '@/common/decorator/number-id.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * Create a new course
   *
   * @param {CreateCourseDto} createCourseDto
   * @returns {Promise<CourseEntity>}
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ tags: ['Create Course'] })
  @ResponseMessage('Course created successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  create(@Body() createCourseDto: CreateCourseDto): Promise<CourseEntity> {
    return this.coursesService.create(createCourseDto);
  }

  /**
   * Get all courses
   *
   * @param {PaginationRequestType} pagination
   * @returns {Promise<PaginationResponseType<CourseEntity>>}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['List Course'] })
  @ResponseMessage('Course list fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findAll(
    @PaginationRequest() pagination: PaginationRequestType,
  ): Promise<PaginationResponseType<CourseEntity>> {
    return this.coursesService.findAll(pagination);
  }

  /**
   * Get a course by id
   *
   * @param {string} id
   * @returns {Promise<CourseEntity>}
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Get Course'] })
  @ResponseMessage('Course fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findOne(@NumberId('id') id: string): Promise<CourseEntity> {
    return this.coursesService.findOne(+id);
  }

  /**
   * Update a course by id
   *
   * @param {string} id
   * @param {UpdateCourseDto} updateCourseDto
   * @returns {Promise<CourseEntity>}
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Update Course'] })
  @ResponseMessage('Course updated successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  update(
    @NumberId('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseEntity> {
    return this.coursesService.update(+id, updateCourseDto);
  }

  /**
   * Delete a course by id
   *
   * @param {string} id
   * @returns {Promise<CourseEntity>}
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ tags: ['Delete Course'] })
  @ResponseMessage('Course deleted successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  remove(@NumberId('id') id: string): Promise<CourseEntity> {
    return this.coursesService.remove(+id);
  }
}
