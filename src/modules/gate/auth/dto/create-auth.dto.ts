import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '../../roles/enums/role.enum';

export class CreateAuthDto {
  // Email
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  // Password
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(RoleEnum)
  readonly login_as: string;
}
