import { Module } from '@nestjs/common';
import RouteHelper from '@/common/helper/route.helper';
import { PeriodsModule } from './periods/periods.module';

const modules = [PeriodsModule];

@Module({
  imports: [...new RouteHelper('academic').register(...modules)],
  controllers: [],
  providers: [],
})
export class AcademicModule {}
