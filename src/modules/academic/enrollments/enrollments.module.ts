import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { enrollmentProviders } from './enrollments.providers';

@Module({
  controllers: [EnrollmentsController],
  providers: [...enrollmentProviders, EnrollmentsService],
})
export class EnrollmentsModule {}
