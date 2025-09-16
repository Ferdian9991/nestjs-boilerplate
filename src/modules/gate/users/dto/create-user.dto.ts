import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

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

  // Is Active
  readonly isActive: boolean;
}
