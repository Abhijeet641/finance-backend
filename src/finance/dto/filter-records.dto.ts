import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { RecordType } from '../../common/enums/index.js';

export class FilterRecordsDto {
  @ApiPropertyOptional({ description: 'Cursor ID for pagination' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ enum: ['INCOME', 'EXPENSE'], description: 'Filter by record type' })
  @IsOptional()
  @IsEnum(RecordType)
  type?: RecordType;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter records from this date (ISO string)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter records until this date (ISO string)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
