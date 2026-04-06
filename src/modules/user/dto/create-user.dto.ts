import {
  IsString,
  MinLength,
  IsInt,
  IsUUID,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  enrollmentNumber: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsUUID()
  degreeId: string;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  section?: string;
}
