import { Inject, Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ACADEMIC_CLASSROOM_REPOSITORY } from './classrooms.providers';
import { Repository } from 'typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import Validation from '@/common/error/validation.error';
import {
  PaginationResponseType,
  QueryHelper,
} from '@/common/helper/query.helper';
import { PaginationRequestType } from '@/common/decorator/pagination-request.decorator';
import NotFound from '@/common/error/not-found.error';
import { ACADEMIC_PERIOD_REPOSITORY } from '../periods/periods.providers';
import { ACADEMIC_COURSE_REPOSITORY } from '../courses/courses.providers';
import { PeriodEntity } from '../periods/entities/period.entity';
import { CourseEntity } from '../courses/entities/course.entity';

@Injectable()
export class ClassroomsService {
  constructor(
    @Inject(ACADEMIC_CLASSROOM_REPOSITORY)
    private classroomRepository: Repository<ClassroomEntity>,
    @Inject(ACADEMIC_PERIOD_REPOSITORY)
    private periodRepository: Repository<PeriodEntity>,
    @Inject(ACADEMIC_COURSE_REPOSITORY)
    private courseRepository: Repository<CourseEntity>,
  ) {}

  /**
   * Create a new classroom
   *
   * @param {CreateClassroomDto} createClassroomDto
   * @returns {Promise<ClassroomEntity>}
   */
  async create(
    createClassroomDto: CreateClassroomDto,
  ): Promise<ClassroomEntity> {
    const classroom = this.classroomRepository.create(createClassroomDto);

    // Check if the referenced course and period exist
    await this.checkReferenceAvailability(
      createClassroomDto.course_id,
      createClassroomDto.period_id,
    );

    // Check if classroom with the same code, course_id, and period_id already exists
    await this.checkClassroomUniqueComposition(
      createClassroomDto.code,
      createClassroomDto.course_id,
      createClassroomDto.period_id,
    );

    return await this.classroomRepository.save(classroom);
  }

  /**
   * Find all courses
   *
   * @param {PaginationRequestType} params
   * @returns {Promise<PaginationResponseType<ClassroomEntity>>}
   */
  findAll(
    params: PaginationRequestType,
  ): Promise<PaginationResponseType<ClassroomEntity>> {
    return QueryHelper.paginate({
      repo: this.classroomRepository,
      alias: 'classroom',
      params,
      searchFields: ['code'],
    });
  }

  /**
   * Find one classroom by id
   *
   * @param {number} id
   * @returns {Promise<ClassroomEntity>}
   */
  async findOne(id: number): Promise<ClassroomEntity> {
    const classroom = await this.classroomRepository.findOne({ where: { id } });

    if (!classroom) {
      throw new NotFound(`Classroom with id ${id} not found`);
    }

    return classroom;
  }

  /**
   * Update a classroom
   *
   * @param {number} id
   * @param {UpdateClassroomDto} updateClassroomDto
   * @returns {Promise<ClassroomEntity>}
   */
  async update(
    id: number,
    updateClassroomDto: UpdateClassroomDto,
  ): Promise<ClassroomEntity> {
    const classroom = await this.findOne(id);

    if (!classroom) {
      throw new NotFound(`Classroom with id ${id} not found`);
    }

    // Check if the referenced course and period exist
    await this.checkReferenceAvailability(
      updateClassroomDto.course_id,
      updateClassroomDto.period_id,
    );

    // Check if classroom with the same code, course_id, and period_id already exists
    await this.checkClassroomUniqueComposition(
      updateClassroomDto.code,
      updateClassroomDto.course_id,
      updateClassroomDto.period_id,
      id,
    );

    Object.assign(classroom, updateClassroomDto);
    return await this.classroomRepository.save(classroom);
  }

  /**
   * Remove a classroom
   *
   * @param {number} id
   * @returns {Promise<ClassroomEntity>}
   */
  async remove(id: number): Promise<ClassroomEntity> {
    const classroom = await this.findOne(id);

    if (!classroom) {
      throw new NotFound(`Classroom with id ${id} not found`);
    }

    return this.classroomRepository.softRemove(classroom);
  }

  /**
   * Check if a classroom with the same code, course_id, and period_id already exists
   *
   * @param {string} code
   * @param {number} courseId
   * @param {number} periodId
   * @param {number} [id]
   * @returns {Promise<void>}
   */
  private async checkClassroomUniqueComposition(
    code: string,
    courseId: number,
    periodId: number,
    id?: number,
  ): Promise<void> {
    const existingClassroom = await this.classroomRepository.findOne({
      where: { code, course_id: courseId, period_id: periodId },
    });

    if (existingClassroom && existingClassroom.id !== id) {
      throw new Validation(
        JSON.stringify([
          {
            field: 'code',
            message: `Classroom with code ${code} for the given course and period already exists.`,
          },
        ]),
      );
    }
  }

  /**
   * Check if the referenced course and period exist
   *
   * @param {number} courseId
   * @param {number} periodId
   * @returns {Promise<void>}
   */
  private async checkReferenceAvailability(
    courseId: number,
    periodId: number,
  ): Promise<void> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new Validation(
        JSON.stringify([
          {
            field: 'course_id',
            message: `Course with id ${courseId} does not exist.`,
          },
        ]),
      );
    }

    const period = await this.periodRepository.findOne({
      where: { id: periodId },
    });

    if (!period) {
      throw new Validation(
        JSON.stringify([
          {
            field: 'period_id',
            message: `Period with id ${periodId} does not exist.`,
          },
        ]),
      );
    }
  }
}
