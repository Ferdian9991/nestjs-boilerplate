import { DataSource } from 'typeorm';
import { CourseEntity } from './entities/course.entity';

export const ACADEMIC_COURSE_REPOSITORY = 'ACADEMIC_COURSE_REPOSITORY';

export const coursesProviders = [
  {
    provide: ACADEMIC_COURSE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CourseEntity),
    inject: ['DATA_SOURCE'],
  },
];
