import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator'

export class CreateProjectDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(['active', 'completed', 'on-hold'])
  status?: string

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: string

  @IsOptional()
  @IsEnum(['private', 'public'])
  visibility?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsString()
  figmaLink?: string

  @IsOptional()
  @IsString()
  documentation?: string
}
