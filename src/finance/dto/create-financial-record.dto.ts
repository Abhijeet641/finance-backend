import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsString, IsDateString, IsOptional, Min } from 'class-validator';
import { RecordType } from '../../common/enums/index.js';

export class CreateFinancialRecordDto {
  @ApiProperty({ example: 5000, description: 'Amount of the transaction' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: ['INCOME', 'EXPENSE'], description: 'Type of record' })
  @IsEnum(RecordType)
  type: RecordType;

  @ApiProperty({ example: 'Salary', description: 'Category of the record' })
  @IsString()
  category: string;

  @ApiProperty({ example: '2025-01-15T00:00:00.000Z', description: 'Date of the transaction' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Monthly salary', description: 'Optional description' })
  @IsOptional()
  @IsString()
  description?: string;
}
