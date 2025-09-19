import { CreatePeriodDto } from '@/modules/academic/periods/dto/create-period.dto';
import { PeriodEntity } from '@/modules/academic/periods/entities/period.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class PeriodSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Make default latest periode
    const periodRepository = dataSource.getRepository(PeriodEntity);
    const nowYear = new Date().getFullYear();

    const data: CreatePeriodDto = {
      code: `${nowYear}2`,
      name: `Periode ${nowYear}2`,
    };

    let period = await periodRepository.findOneBy({ code: data.code });

    // Insert only one record with this code.
    if (!period) {
      const periodCreate = periodRepository.create(data);
      period = await periodRepository.save(periodCreate);
    }

    // Get user factory from factory manager.
    const periodFactory = factoryManager.get(PeriodEntity);

    try {
      // Insert many records in database.
      await periodFactory.saveMany(5);
    } catch {
      // Assume that any error is due to duplicate entries and ignore it.
      console.warn('Periods already seeded, skipping...');
    }
  }
}
