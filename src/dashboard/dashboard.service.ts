import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [totalIncome, totalExpense, categoryBreakdown, recentRecords, trends] =
      await Promise.all([
        this.getTotalIncome(),
        this.getTotalExpense(),
        this.getCategoryBreakdown(),
        this.getRecentActivity(),
        this.getMonthlyTrends(),
      ]);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryBreakdown,
      recentRecords,
      trends,
    };
  }

  async getTotalIncome(): Promise<number> {
    const result = await this.prisma.financialRecord.aggregate({
      _sum: { amount: true },
      where: { type: 'INCOME', isDeleted: false },
    });

    return result._sum.amount || 0;
  }

  async getTotalExpense(): Promise<number> {
    const result = await this.prisma.financialRecord.aggregate({
      _sum: { amount: true },
      where: { type: 'EXPENSE', isDeleted: false },
    });

    return result._sum.amount || 0;
  }

  async getNetBalance(): Promise<number> {
    const income = await this.getTotalIncome();
    const expense = await this.getTotalExpense();
    return income - expense;
  }

  async getCategoryBreakdown() {
    const result = await this.prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      _sum: { amount: true },
      where: { isDeleted: false },
      orderBy: { _sum: { amount: 'desc' } },
    });

    return result.map((item) => ({
      category: item.category,
      type: item.type,
      total: item._sum.amount || 0,
    }));
  }

  async getRecentActivity(limit: number = 10) {
    return this.prisma.financialRecord.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getMonthlyTrends() {
    // Get records grouped by month
    const records = await this.prisma.financialRecord.findMany({
      where: { isDeleted: false },
      orderBy: { date: 'asc' },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    // Aggregate by month
    const monthlyMap = new Map<
      string,
      { income: number; expense: number }
    >();

    for (const record of records) {
      const monthKey = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { income: 0, expense: 0 });
      }

      const entry = monthlyMap.get(monthKey)!;
      if (record.type === 'INCOME') {
        entry.income += record.amount;
      } else {
        entry.expense += record.amount;
      }
    }

    return Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}
