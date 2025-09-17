import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  // Role Code
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly code: string;

  // Role Name
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly name: string;

  // Is Active
  readonly isActive: boolean;
}
