import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, Max, MaxLength } from 'class-validator';

export class CreateClassroomDto {
  // Classroom Code
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly code: string;

  // Day of the week (0-6, where 0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  @IsNotEmpty()
  @Type(() => Number)
  @Max(6)
  readonly day: number;

  // Start Time (HH:MM:SS)
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'start_time must be in the format HH:MM:SS',
  })
  readonly start_time: string;

  // End Time (HH:MM:SS)
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'end_time must be in the format HH:MM:SS',
  })
  readonly end_time: string;

  // Quota
  @IsNotEmpty()
  @Type(() => Number)
  readonly quota: number;

  // Course ID
  @IsNotEmpty()
  @Type(() => Number)
  readonly course_id: number;

  // Period ID
  @IsNotEmpty()
  @Type(() => Number)
  readonly period_id: number;

  readonly participants_count: number = 0;
}
