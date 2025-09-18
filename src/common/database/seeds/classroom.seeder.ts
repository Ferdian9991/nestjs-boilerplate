import { ClassroomEntity } from '@/modules/academic/classrooms/entities/classroom.entity';
import { CourseEntity } from '@/modules/academic/courses/entities/course.entity';
import { PeriodEntity } from '@/modules/academic/periods/entities/period.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class ClassroomSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Get classroom factory from factory manager.
    const classroomFactory = factoryManager.get(ClassroomEntity);

    // Get course repository from database source.
    const courseRepository = dataSource.getRepository(CourseEntity);

    // Get period repository from database source.
    const periodRepository = dataSource.getRepository(PeriodEntity);

    // Get all courses from database limit 80 records.
    const courses = await courseRepository.find({
      take: 80,
    });

    // Find current period from database.
    const findPeriod = await periodRepository.findOneBy({
      code: `${new Date().getFullYear()}2`,
    });

    if (!findPeriod) {
      throw new Error('Current period not found');
    }

    const periodId = findPeriod.id;

    // Insert many records in database.
    for (const course of courses) {
      await classroomFactory.saveMany(1, {
        course_id: course.id,
        period_id: periodId,
      });
    }
  }
}
