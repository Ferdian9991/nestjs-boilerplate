import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePeriodDto {
  // Period Code
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly code: string;

  // Period Name
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly name: string;
}
