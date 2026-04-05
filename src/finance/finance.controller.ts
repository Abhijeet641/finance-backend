import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FinanceService } from './finance.service.js';
import {
  CreateFinancialRecordDto,
  UpdateFinancialRecordDto,
  FilterRecordsDto,
} from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { Roles, CurrentUser } from '../common/decorators/index.js';
import { Role } from '../common/enums/index.js';

@ApiTags('Finance')
@ApiBearerAuth()
@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a financial record (Admin only)' })
  @ApiResponse({ status: 201, description: 'Record created successfully' })
  async create(
    @Body() dto: CreateFinancialRecordDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.financeService.create(dto, userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ANALYST)
  @ApiOperation({ summary: 'Get financial records with filters and pagination (Admin, Analyst)' })
  @ApiResponse({ status: 200, description: 'List of financial records' })
  async findAll(@Query() filters: FilterRecordsDto) {
    return this.financeService.findAll(filters);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.ANALYST)
  @ApiOperation({ summary: 'Get a single financial record (Admin, Analyst)' })
  @ApiResponse({ status: 200, description: 'Financial record details' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id') id: string) {
    return this.financeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a financial record (Admin only)' })
  @ApiResponse({ status: 200, description: 'Record updated successfully' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFinancialRecordDto,
  ) {
    return this.financeService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete a financial record (Admin only)' })
  @ApiResponse({ status: 200, description: 'Record soft deleted' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async remove(@Param('id') id: string) {
    return this.financeService.softDelete(id);
  }
}
