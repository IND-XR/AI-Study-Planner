import { IsNumber, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgressRecordDto {
  @IsString()
  topicId: string;

  @IsDate()
  @Type(() => Date)
  studyDate: Date;

  @IsNumber()
  hoursSpent: number;

  @IsOptional()
  @IsString()
  confidenceLevel?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  rating?: number; // 1-5
}

export class UpdateProgressRecordDto {
  @IsOptional()
  @IsNumber()
  hoursSpent?: number;

  @IsOptional()
  @IsString()
  confidenceLevel?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;
}
