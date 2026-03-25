import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsInt()
  semester?: number;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
