import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateCourseDto {
  // Course Code
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly code: string;

  // Course Name
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly name: string;

  // Course Credits
  @IsNotEmpty()
  @Type(() => Number)
  @Max(10)
  readonly credits: number;
}
