import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import UserSeeder from './seeds/user.seeder';
import userFactory from './factories/user.factory';
import PeriodSeeder from './seeds/period.seeder';
import periodFactory from './factories/period.factory';
import CourseSeeder from './seeds/course.seeder';
import courseFactory from './factories/course.factory';

export default class SeedDatabase implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await runSeeders(dataSource, {
      seeds: [UserSeeder, PeriodSeeder, CourseSeeder],
      factories: [userFactory, periodFactory, courseFactory],
    });
  }
}
