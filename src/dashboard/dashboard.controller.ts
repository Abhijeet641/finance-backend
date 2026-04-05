import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { Roles } from '../common/decorators/index.js';
import { Role } from '../common/enums/index.js';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Roles(Role.ADMIN, Role.ANALYST, Role.VIEWER)
  @ApiOperation({ summary: 'Get full dashboard summary (All roles)' })
  @ApiResponse({ status: 200, description: 'Dashboard summary data' })
  async getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('total-income')
  @Roles(Role.ADMIN, Role.ANALYST, Role.VIEWER)
  @ApiOperation({ summary: 'Get total income' })
  @ApiResponse({ status: 200, description: 'Total income amount' })
  async getTotalIncome() {
    const totalIncome = await this.dashboardService.getTotalIncome();
    return { totalIncome };
  }

  @Get('total-expense')
  @Roles(Role.ADMIN, Role.ANALYST, Role.VIEWER)
  @ApiOperation({ summary: 'Get total expenses' })
  @ApiResponse({ status: 200, description: 'Total expense amount' })
  async getTotalExpense() {
    const totalExpense = await this.dashboardService.getTotalExpense();
    return { totalExpense };
  }

  @Get('net-balance')
  @Roles(Role.ADMIN, Role.ANALYST, Role.VIEWER)
  @ApiOperation({ summary: 'Get net balance (income - expenses)' })
  @ApiResponse({ status: 200, description: 'Net balance' })
  async getNetBalance() {
    const netBalance = await this.dashboardService.getNetBalance();
    return { netBalance };
  }

  @Get('category-breakdown')
  @Roles(Role.ADMIN, Role.ANALYST, Role.VIEWER)
  @ApiOperation({ summary: 'Get category-wise breakdown' })
  @ApiResponse({ status: 200, description: 'Category breakdown data' })
  async getCategoryBreakdown() {
    return this.dashboardService.getCategoryBreakdown();
  }

  @Get('recent-activity')
  @Roles(Role.ADMIN, Role.ANALYST, Role.VIEWER)
  @ApiOperation({ summary: 'Get recent financial activity' })
  @ApiResponse({ status: 200, description: 'Recent records' })
  async getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }

  @Get('trends')
  @Roles(Role.ADMIN, Role.ANALYST, Role.VIEWER)
  @ApiOperation({ summary: 'Get monthly income/expense trends' })
  @ApiResponse({ status: 200, description: 'Monthly trend data' })
  async getTrends() {
    return this.dashboardService.getMonthlyTrends();
  }
}
