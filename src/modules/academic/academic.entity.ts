import { ClassroomEntity } from './classrooms/entities/classroom.entity';
import { CourseEntity } from './courses/entities/course.entity';
import { EnrollmentEntity } from './enrollments/entities/enrollment.entity';
import { PeriodEntity } from './periods/entities/period.entity';

export const AcademicEntity = [
  PeriodEntity,
  CourseEntity,
  ClassroomEntity,
  EnrollmentEntity,
];
