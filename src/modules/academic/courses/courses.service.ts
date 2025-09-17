import { Inject, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ACADEMIC_COURSE_REPOSITORY } from './courses.providers';
import { Repository } from 'typeorm';
import { CourseEntity } from './entities/course.entity';
import Validation from '@/common/error/validation.error';
import { PaginationRequestType } from '@/common/decorator/pagination-request.decorator';
import {
  PaginationResponseType,
  QueryHelper,
} from '@/common/helper/query.helper';
import NotFound from '@/common/error/not-found.error';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(ACADEMIC_COURSE_REPOSITORY)
    private courseRepository: Repository<CourseEntity>,
  ) {}

  /**
   * Create a new course
   *
   * @param {CreateCourseDto} createCourseDto
   * @returns {Promise<CourseEntity>}
   */
  async create(createCourseDto: CreateCourseDto): Promise<CourseEntity> {
    const course = this.courseRepository.create(createCourseDto);

    // Check if course code already exists
    await this.checkCourseCodeExists(createCourseDto.code);

    return await this.courseRepository.save(course);
  }

  /**
   * Find all courses
   *
   * @param {PaginationRequestType} params
   * @returns {Promise<PaginationResponseType<CourseEntity>>}
   */
  findAll(
    params: PaginationRequestType,
  ): Promise<PaginationResponseType<CourseEntity>> {
    return QueryHelper.paginate({
      repo: this.courseRepository,
      alias: 'course',
      params,
      searchFields: ['code', 'name'],
    });
  }

  /**
   * Find one course by id
   *
   * @param {number} id
   * @returns {Promise<CourseEntity>}
   */
  async findOne(id: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({ where: { id } });

    if (!course) {
      throw new NotFound(`Course with id ${id} not found`);
    }

    return course;
  }

  /**
   * Update a course
   *
   * @param {number} id
   * @param {UpdateCourseDto} updateCourseDto
   * @returns {Promise<CourseEntity>}
   */
  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseEntity> {
    const course = await this.findOne(id);

    if (!course) {
      throw new NotFound(`Course with id ${id} not found`);
    }

    this.checkCourseCodeExists(updateCourseDto.code, id);

    Object.assign(course, updateCourseDto);

    return await this.courseRepository.save(course);
  }

  /**
   * Remove a course
   *
   * @param {number} id
   * @returns {Promise<CourseEntity>}
   */
  async remove(id: number): Promise<CourseEntity> {
    const course = await this.findOne(id);

    if (!course) {
      throw new NotFound(`Course with id ${id} not found`);
    }

    return await this.courseRepository.softRemove(course);
  }

  /**
   * Check if course code already exists
   *
   * @param {string} code
   * @param {number} [id]
   * @returns {Promise<void>}
   */
  private async checkCourseCodeExists(
    code: string,
    id?: number,
  ): Promise<void> {
    const course = await this.courseRepository.findOne({ where: { code } });

    if (course && course.id !== id) {
      throw new Validation(
        JSON.stringify([
          { field: 'code', message: 'Course code already exists' },
        ]),
      );
    }
  }
}
