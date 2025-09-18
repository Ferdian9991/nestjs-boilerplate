import { CourseEntity } from '@/modules/academic/courses/entities/course.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class CourseSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Get course factory from factory manager.
    const courseFactory = factoryManager.get(CourseEntity);

    // Insert many records in database.
    await courseFactory.saveMany(80);
  }
}
