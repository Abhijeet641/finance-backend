import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFinancialRecordDto } from './dto/create-financial-record.dto.js';
import { UpdateFinancialRecordDto } from './dto/update-financial-record.dto.js';
import { FilterRecordsDto } from './dto/filter-records.dto.js';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFinancialRecordDto, userId: string) {
    return this.prisma.financialRecord.create({
      data: {
        amount: dto.amount,
        type: dto.type,
        category: dto.category,
        date: new Date(dto.date),
        description: dto.description,
        createdBy: userId,
      },
    });
  }

  async findAll(filters: FilterRecordsDto) {
    const where: Record<string, unknown> = { isDeleted: false };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        (where.date as Record<string, unknown>).gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        (where.date as Record<string, unknown>).lte = new Date(filters.endDate);
      }
    }

    return this.prisma.financialRecord.findMany({
      where,
      take: 10,
      skip: filters.cursor ? 1 : 0,
      cursor: filters.cursor ? { id: filters.cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.financialRecord.findUnique({
      where: { id },
    });

    if (!record || record.isDeleted) {
      throw new NotFoundException('Financial record not found');
    }

    return record;
  }

  async update(id: string, dto: UpdateFinancialRecordDto) {
    const record = await this.prisma.financialRecord.findUnique({
      where: { id },
    });

    if (!record || record.isDeleted) {
      throw new NotFoundException('Financial record not found');
    }

    const data: Record<string, unknown> = {};
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.date !== undefined) data.date = new Date(dto.date);
    if (dto.description !== undefined) data.description = dto.description;

    return this.prisma.financialRecord.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    const record = await this.prisma.financialRecord.findUnique({
      where: { id },
    });

    if (!record || record.isDeleted) {
      throw new NotFoundException('Financial record not found');
    }

    return this.prisma.financialRecord.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
