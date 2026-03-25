import { IsNumber, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateStudyPlanDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  totalDailyHours: number;

  @IsOptional()
  @IsNumber()
  totalWeeklyHours?: number;

  @IsOptional()
  @IsNumber()
  distributionStrategy?: number; // 0 = equal, 1 = priority-based, 2 = difficulty-based
}

export class AddExamToStudyPlanDto {
  @IsNumber()
  examId: string;
}
