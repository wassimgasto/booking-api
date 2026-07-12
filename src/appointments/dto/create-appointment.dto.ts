import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  clientName: string;

  @IsEmail()
  clientEmail: string;

  @IsISO8601()
  startTime: string;

  @IsISO8601()
  endTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
