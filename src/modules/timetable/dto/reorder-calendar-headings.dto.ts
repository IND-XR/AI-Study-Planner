import { ArrayMinSize, IsArray, IsDateString, IsUUID } from 'class-validator';

export class ReorderCalendarHeadingsDto {
  @IsDateString()
  date: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  headingIds: string[];
}
