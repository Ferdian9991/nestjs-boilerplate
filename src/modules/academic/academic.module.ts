import { Module } from '@nestjs/common';
import RouteHelper from '@/common/helper/route.helper';
import { PeriodsModule } from './periods/periods.module';
import { CoursesModule } from './courses/courses.module';

const modules = [PeriodsModule, CoursesModule];

@Module({
  imports: [...new RouteHelper('academic').register(...modules)],
  controllers: [],
  providers: [],
})
export class AcademicModule {}
