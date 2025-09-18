import { setSeederFactory } from 'typeorm-extension';
import { ClassroomEntity } from '@/modules/academic/classrooms/entities/classroom.entity';

export default setSeederFactory(ClassroomEntity, async (faker) => {
  const classroom = new ClassroomEntity();

  classroom.code = `CL-${faker.string.alphanumeric({ length: 6 }).toUpperCase()}`;
  classroom.day = faker.number.int({ min: 0, max: 6 });
  classroom.start_time = `${faker.number.int({ min: 8, max: 15 })}:00:00`;
  classroom.end_time = `${faker.number.int({ min: 16, max: 18 })}:00:00`;
  classroom.quota = faker.number.int({ min: 20, max: 80 });
  classroom.participants_count = 0;
  classroom.course_id = faker.number.int({ min: 1, max: 20 });
  classroom.period_id = faker.number.int({ min: 1, max: 5 });

  return classroom;
});
