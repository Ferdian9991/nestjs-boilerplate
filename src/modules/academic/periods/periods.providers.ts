import { DataSource } from 'typeorm';
import { PeriodEntity } from './entities/period.entity';

export const ACADEMIC_PERIOD_REPOSITORY = 'ACADEMIC_PERIOD_REPOSITORY';

export const periodsProviders = [
  {
    provide: ACADEMIC_PERIOD_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PeriodEntity),
    inject: ['DATA_SOURCE'],
  },
];
