import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/index.js';

export class CreateUserDto {
  @ApiProperty({ example: 'user@finance.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: ['VIEWER', 'ANALYST', 'ADMIN'], description: 'User role' })
  @IsEnum(Role)
  role: Role;
}
