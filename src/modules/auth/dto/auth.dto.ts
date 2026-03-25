
import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  enrollmentNumber: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  enrollmentNumber: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  role?: string;
}