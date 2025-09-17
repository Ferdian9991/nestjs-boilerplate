import { DataSource } from 'typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { ACADEMIC_COURSE_REPOSITORY } from '../courses/courses.providers';
import { CourseEntity } from '../courses/entities/course.entity';
import { ACADEMIC_PERIOD_REPOSITORY } from '../periods/periods.providers';
import { PeriodEntity } from '../periods/entities/period.entity';

export const ACADEMIC_CLASSROOM_REPOSITORY = 'ACADEMIC_CLASSROOM_REPOSITORY';

export const classroomsProviders = [
  {
    provide: ACADEMIC_PERIOD_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PeriodEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: ACADEMIC_COURSE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CourseEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: ACADEMIC_CLASSROOM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ClassroomEntity),
    inject: ['DATA_SOURCE'],
  },
];
