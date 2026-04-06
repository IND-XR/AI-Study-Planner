import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum CalendarHeadingTagDto {
  STUDY = 'STUDY',
  CODING = 'CODING',
  EXAM = 'EXAM',
  OTHER = 'OTHER',
}

export class CreateCalendarHeadingDto {
  @IsDateString()
  date: string;

  @IsString()
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsEnum(CalendarHeadingTagDto)
  tag?: CalendarHeadingTagDto;
}
