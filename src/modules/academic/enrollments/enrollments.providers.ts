import { DataSource } from 'typeorm';
import { EnrollmentEntity } from './entities/enrollment.entity';

export const ACADEMIC_ENROLLMENT_REPOSITORY = 'ACADEMIC_ENROLLMENT_REPOSITORY';

export const enrollmentProviders = [
  {
    provide: ACADEMIC_ENROLLMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EnrollmentEntity),
    inject: ['DATA_SOURCE'],
  },
];
