import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Cursor for pagination (ID of last record)' })
  @IsOptional()
  @IsString()
  cursor?: string;
}
