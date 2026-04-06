import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDegreeDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  code?: string;
}
