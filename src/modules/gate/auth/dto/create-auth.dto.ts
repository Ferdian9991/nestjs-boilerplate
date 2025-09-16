import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

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
  public password: string;
}
