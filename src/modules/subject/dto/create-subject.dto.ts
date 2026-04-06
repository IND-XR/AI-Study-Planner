import { IsString, IsUUID, IsOptional, IsInt } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsUUID()
  degreeId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsInt()
  semester?: number;
}
