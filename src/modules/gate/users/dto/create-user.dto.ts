import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '../../roles/enums/role.enum';

export class CreateUserDto {
  // Full Name
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly fullname: string;

  // Username
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly username: string;

  // Email
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  readonly email: string;

  // Password
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(1024)
  public password: string;

  // Role
  @IsOptional()
  @IsString()
  @IsEnum(RoleEnum)
  readonly role_code?: string;

  // Is Active
  readonly is_ctive: boolean;
}
