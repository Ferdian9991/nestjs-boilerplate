import { Module } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { PeriodsController } from './periods.controller';
import { periodsProviders } from './periods.providers';

@Module({
  controllers: [PeriodsController],
  providers: [...periodsProviders, PeriodsService],
})
export class PeriodsModule {}
