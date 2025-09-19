import { Inject, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { ACADEMIC_ENROLLMENT_REPOSITORY } from './enrollments.providers';
import { Repository } from 'typeorm';
import { EnrollmentEntity } from './entities/enrollment.entity';
import { PaginationRequestType } from '@/common/decorator/pagination-request.decorator';
import {
  PaginationResponseType,
  QueryHelper,
} from '@/common/helper/query.helper';

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

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(ACADEMIC_ENROLLMENT_REPOSITORY)
    private enrollmentRepository: Repository<EnrollmentEntity>,
  ) {}

  create(createEnrollmentDto: CreateEnrollmentDto) {
    return 'This action adds a new enrollment';
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

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }
}
