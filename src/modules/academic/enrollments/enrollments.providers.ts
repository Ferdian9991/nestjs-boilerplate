import { DataSource } from 'typeorm';
import { EnrollmentEntity } from './entities/enrollment.entity';
import { ACADEMIC_PERIOD_REPOSITORY } from '../periods/periods.providers';
import { PeriodEntity } from '../periods/entities/period.entity';
import { ACADEMIC_CLASSROOM_REPOSITORY } from '../classrooms/classrooms.providers';
import { ClassroomEntity } from '../classrooms/entities/classroom.entity';

export const ACADEMIC_ENROLLMENT_REPOSITORY = 'ACADEMIC_ENROLLMENT_REPOSITORY';

export const enrollmentProviders = [
  {
    provide: ACADEMIC_ENROLLMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EnrollmentEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: ACADEMIC_PERIOD_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PeriodEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: ACADEMIC_CLASSROOM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ClassroomEntity),
    inject: ['DATA_SOURCE'],
  },
];
