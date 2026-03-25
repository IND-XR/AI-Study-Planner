import { IsString, IsOptional, IsNumber, IsDate, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamDto {
  @IsString()
  subjectId: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  totalMarks?: number;

  @IsOptional()
  @IsNumber()
  targetScore?: number;

  @IsDate()
  @Type(() => Date)
  examinationDate: Date;

  @IsOptional()
  @IsInt()
  weightage?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateExamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  totalMarks?: number;

  @IsOptional()
  @IsNumber()
  targetScore?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  examinationDate?: Date;

  @IsOptional()
  @IsInt()
  weightage?: number;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsNumber()
  actualScore?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
