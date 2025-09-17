import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { classroomsProviders } from './classrooms.providers';

@Module({
  controllers: [ClassroomsController],
  providers: [...classroomsProviders, ClassroomsService],
})
export class ClassroomsModule {}
