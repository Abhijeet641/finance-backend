import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsString, IsDateString, IsOptional, Min } from 'class-validator';
import { RecordType } from '../../common/enums/index.js';

export class UpdateFinancialRecordDto {
  @ApiPropertyOptional({ example: 5000, description: 'Amount of the transaction' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({ enum: ['INCOME', 'EXPENSE'], description: 'Type of record' })
  @IsOptional()
  @IsEnum(RecordType)
  type?: RecordType;

  @ApiPropertyOptional({ example: 'Salary', description: 'Category of the record' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: '2025-01-15T00:00:00.000Z', description: 'Date of the transaction' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: 'Monthly salary', description: 'Optional description' })
  @IsOptional()
  @IsString()
  description?: string;
}
