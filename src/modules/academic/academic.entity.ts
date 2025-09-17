import { ClassroomEntity } from './classrooms/entities/classroom.entity';
import { CourseEntity } from './courses/entities/course.entity';
import { PeriodEntity } from './periods/entities/period.entity';

export const AcademicEntity = [PeriodEntity, CourseEntity, ClassroomEntity];
