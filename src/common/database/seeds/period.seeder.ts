import { PeriodEntity } from '@/modules/academic/periods/entities/period.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class PeriodSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const periodFactory = factoryManager.get(PeriodEntity);

    try {
      // Insert many records in database.
      await periodFactory.saveMany(5);
    } catch (error) {
      // Assume that any error is due to duplicate entries and ignore it.
      console.warn('Periods already seeded, skipping...');
    }
  }
}
