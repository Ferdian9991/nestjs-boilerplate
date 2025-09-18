import { setSeederFactory } from 'typeorm-extension';
import { CourseEntity } from '@/modules/academic/courses/entities/course.entity';

export default setSeederFactory(CourseEntity, async (faker) => {
  const course = new CourseEntity();

  course.code = `C-${faker.string.alphanumeric({ length: 6 }).toUpperCase()}`;
  course.name = `Course ${faker.word.words({ count: 3 })}`;
  course.credits = faker.number.int({ min: 1, max: 6 });

  return course;
});
