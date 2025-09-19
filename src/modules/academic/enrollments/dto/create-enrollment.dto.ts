import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  // Classroom ID
  @IsNotEmpty()
  @Type(() => Number)
  readonly classroom_id: number;

  // Period ID
  @IsNotEmpty()
  @Type(() => Number)
  readonly period_id: number;
}
