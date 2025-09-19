import { Inject, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ACADEMIC_ENROLLMENT_REPOSITORY } from './enrollments.providers';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { EnrollmentEntity } from './entities/enrollment.entity';
import { PaginationRequestType } from '@/common/decorator/pagination-request.decorator';
import {
  PaginationResponseType,
  QueryHelper,
} from '@/common/helper/query.helper';
import Validation from '@/common/error/validation.error';
import { PeriodEntity } from '../periods/entities/period.entity';
import { ClassroomEntity } from '../classrooms/entities/classroom.entity';
import { AuthType } from '@/common/decorator/auth.decorator';
import { CourseEntity } from '../courses/entities/course.entity';

export interface EnrolledClassroom {
  period: string;
  period_name: string;
  classroom_code: string;
  course_name: string;
  start_time: string;
  end_time: string;
  quota: number;
  participants_count: number;
}

export interface EnrolledClassroomWithCredits extends ClassroomEntity {
  credits: number;
}

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(ACADEMIC_ENROLLMENT_REPOSITORY)
    private enrollmentRepository: Repository<EnrollmentEntity>,
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a new enrollment
   *
   * @param {AuthType} auth
   * @param {CreateEnrollmentDto} createEnrollmentDto
   * @returns {Promise<EnrollmentEntity[]>}
   */
  async create(
    auth: AuthType,
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<ClassroomEntity> {
    return await this.dataSource.transaction(async (manager) => {
      return await this.addEnrollment(manager, auth, createEnrollmentDto);
    });
  }

  /**
   * Find all enrolled classrooms
   *
   * @param {PaginationRequestType} params
   * @returns {Promise<PaginationResponseType<EnrolledClassroom>>}
   */
  async findAll(
    params: PaginationRequestType,
  ): Promise<PaginationResponseType<EnrolledClassroom>> {
    const sql = `
      WITH enrolled_classrooms AS (
          SELECT
            c.period_id,
            c.id classroom_id,
            p.code period,
            p.name period_name,
            c.code classroom_code,
            cr.name course_name,
            c.start_time,
            c.end_time,
            c.quota,
            c.participants_count,
            c.deleted_at
          FROM academic.classrooms c
          JOIN academic.periods p ON p.id = c.period_id AND p.deleted_at IS NULL
          JOIN academic.courses cr ON cr.id = c.course_id AND cr.deleted_at IS NULL
      )
      SELECT * FROM enrolled_classrooms e
    `;

    const enrolledClassrooms =
      await QueryHelper.paginateRawQuery<EnrolledClassroom>({
        repo: this
          .enrollmentRepository as unknown as Repository<EnrolledClassroom>,
        baseQuery: sql,
        alias: 'e',
        params,
        searchFields: ['period', 'course_name', 'classroom_code'],
        skipCheckValidColumns: true,
      });

    return enrolledClassrooms;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }

  /**
   * Add enrollment
   *
   * @param {EntityManager} manager
   * @param {AuthType} auth
   * @param {CreateEnrollmentDto} enrollment
   * @returns {Promise<ClassroomEntity>}
   */
  private async addEnrollment(
    manager: EntityManager,
    auth: AuthType,
    enrollment: CreateEnrollmentDto,
  ): Promise<ClassroomEntity> {
    // Check selected period exists in database
    const period = await manager.getRepository(PeriodEntity).findOne({
      where: { id: enrollment.period_id },
    });

    // If period not found, throw error
    if (!period) {
      this.throwValidationError(
        'period_id',
        `Period with id ${enrollment.period_id} not found`,
      );
    }

    // Check selected classroom exists in database
    const classroom = await manager.getRepository(ClassroomEntity).findOne({
      where: { id: enrollment.classroom_id },
      lock: { mode: 'pessimistic_write' },
    });

    // If classroom not found, throw error
    if (!classroom) {
      this.throwValidationError(
        'classroom_id',
        `Classroom with id ${enrollment.classroom_id} not found`,
      );
    }

    const course = await manager.getRepository(CourseEntity).findOne({
      where: { id: classroom.course_id },
    });

    // If course not found, throw error
    if (!course) {
      this.throwValidationError(
        'classroom_id',
        `Course with id ${classroom.course_id} not found`,
      );
    }

    // Check is has enrolled in the classroom
    const hasEnrolled = await manager.getRepository(EnrollmentEntity).exists({
      where: {
        classroom_id: enrollment.classroom_id,
        participant_id: auth.id,
      },
    });

    // If has enrolled, throw error
    if (hasEnrolled) {
      this.throwValidationError(
        'classroom_id',
        `You have enrolled in classroom with id ${enrollment.classroom_id}`,
      );
    }

    // Check classroom period must be the same as selected period
    if (classroom.period_id != enrollment.period_id) {
      this.throwValidationError(
        'classroom_id',
        `Classroom period does not match with selected period`,
      );
    }

    // Get all enrolled classrooms for the participant in the selected period
    const enrolledClassrooms = await this.getEnrolledClassrooms(auth.id);

    // Check classroom overlap
    await this.checkClassroomOverlap(enrolledClassrooms, classroom);

    // Check classroom quota
    if (classroom.participants_count >= classroom.quota) {
      this.throwValidationError(
        'classroom_id',
        `Classroom ${classroom.code} quota is full`,
      );
    }

    // Count total credits from enrolled classrooms
    const totalCredits = enrolledClassrooms.reduce(
      (total, enrolledClassroom) => total + enrolledClassroom.credits,
      0,
    );

    // Check if total credits exceed the maximum credits, max is 24
    if (totalCredits + course.credits > 24) {
      this.throwValidationError(
        'classroom_id',
        `Total credits exceed the maximum credits of 24`,
      );
    }

    // Save enrollment
    await manager.getRepository(EnrollmentEntity).save(
      manager.getRepository(EnrollmentEntity).create({
        classroom_id: enrollment.classroom_id,
        participant_id: auth.id,
      }),
    );

    // Update classroom participants count
    classroom.participants_count += 1;
    return await manager.getRepository(ClassroomEntity).save(classroom);
  }

  /**
   * Check classroom overlap
   *
   * @param {ClassroomEntity[]} enrolledClassrooms
   * @param {ClassroomEntity} classroom
   * @returns {Promise<void>}
   */
  private async checkClassroomOverlap(
    enrolledClassrooms: EnrolledClassroomWithCredits[],
    classroom: ClassroomEntity,
  ): Promise<void> {
    const start = this.timeToMinutes(classroom.start_time);
    const end = this.timeToMinutes(classroom.end_time);

    for (const enrolledClassroom of enrolledClassrooms) {
      if (enrolledClassroom.day !== classroom.day) continue;

      const enrolledStart = this.timeToMinutes(enrolledClassroom.start_time);
      const enrolledEnd = this.timeToMinutes(enrolledClassroom.end_time);

      const isOverlap = start < enrolledEnd && end > enrolledStart;

      if (isOverlap) {
        this.throwValidationError(
          'classroom_id',
          `Classroom ${classroom.code} overlaps with enrolled classroom ${enrolledClassroom.code}`,
        );
      }
    }
  }

  /**
   * Get all enrolled classrooms for the participant in the selected period
   *
   * @param {number} participantId
   * @returns {Promise<ClassroomEntity[]>}
   */
  private async getEnrolledClassrooms(
    participantId: number,
  ): Promise<EnrolledClassroomWithCredits[]> {
    // Get all enrolled classrooms for the participant in the selected period
    return await this.dataSource
      .getRepository(EnrollmentEntity)
      .createQueryBuilder('e')
      .innerJoin(
        ClassroomEntity,
        'c',
        'c.id = e.classroom_id AND c.deleted_at IS NULL',
      )
      .innerJoin(
        CourseEntity,
        'cr',
        'cr.id = c.course_id AND cr.deleted_at IS NULL',
      )
      .where('e.participant_id = :participantId', { participantId })
      .select(['c.*', 'cr.credits AS credits'])
      .getRawMany();
  }

  /**
   * Convert time string to minutes
   *
   * @param {string} time
   * @returns {number}
   */
  private timeToMinutes(time: string): number {
    const [h, m, s] = time.split(':').map(Number);
    return h * 60 + m + (s ?? 0) / 60;
  }

  /**
   * Throw validation error
   *
   * @param {string} field
   * @param {string} message
   * @returns {void}
   */
  private throwValidationError(field: string, message: string): void {
    throw new Validation(
      JSON.stringify([
        {
          field,
          message,
        },
      ]),
    );
  }
}
