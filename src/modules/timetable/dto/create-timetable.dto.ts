import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTimetableDto {
  @IsUUID()
  degreeId: string;

  @IsString()
  day: string; // Monday, Tuesday, etc.

  @IsString()
  subject: string;

  @IsString()
  startTime: string; // 09:00

  @IsString()
  endTime: string; // 10:00

  @IsString()
  room: string;

  @IsString()
  type: string; // Lecture, Practical, Tutorial

  @IsOptional()
  @IsString()
  section?: string; // e.g., A, B, C, ALL
}
