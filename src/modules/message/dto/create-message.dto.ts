import { IsBoolean, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  sendToAll?: boolean;

  @ValidateIf((dto: CreateMessageDto) => !dto.sendToAll)
  @IsUUID()
  degreeId: string;
}
