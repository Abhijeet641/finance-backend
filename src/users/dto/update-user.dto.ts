import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Role } from '../../common/enums/index.js';

export class UpdateUserDto {
  @ApiPropertyOptional({ enum: ['VIEWER', 'ANALYST', 'ADMIN'], description: 'User role' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ description: 'Whether the user account is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
