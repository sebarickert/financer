import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { TransactionCategoryMappingRepo } from '../../database/repos/transaction-category-mapping.repo';
import { ForceMutable } from '../../types/force-mutable';
import { UserId } from '../../types/user-id';
import { DateService } from '../../utils/date.service';
import { CategoryMonthlySummaryDto } from '../transaction-categories/dto/transaction-month-summary.dto';

import { CreateTransactionCategoryMappingDto } from './dto/create-transaction-category-mapping.dto';
import { TransactionCategoryMappingDto } from './dto/transaction-category-mapping.dto';

@Injectable()
export class TransactionCategoryMappingsService {
  constructor(
    private readonly transactionCategoryMappingRepo: TransactionCategoryMappingRepo,
  ) {}

  createMany(
    userId: UserId,
    createTransactionCategoryMappingDto: CreateTransactionCategoryMappingDto[],
  ) {
    return this.transactionCategoryMappingRepo.createMany(
      // @ts-expect-error - remove legacy `v` from import data
      createTransactionCategoryMappingDto.map(({ v, ...category }) => ({
        ...category,
        userId,
      })),
    );
  }

  findAll() {
    return `This action returns all transactionCategoryMappings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionCategoryMapping`;
  }

  async findAllByUser(
    userId: UserId,
  ): Promise<TransactionCategoryMappingDto[]> {
    const mappings = await this.transactionCategoryMappingRepo.findMany({
      where: { userId },
    });

    return TransactionCategoryMappingDto.createFromPlain(mappings);
  }

  async findAllByUserForExport(
    userId: UserId,
  ): Promise<TransactionCategoryMappingDto[]> {
    const mappings = await this.transactionCategoryMappingRepo.findMany({
      where: { userId },
    });
    return TransactionCategoryMappingDto.createFromPlain(mappings);
  }

  async findAllByUserAndCategoryIds(
    userId: UserId,
    categoryIds: string[],
  ): Promise<TransactionCategoryMappingDto[]> {
    const mappings = await this.transactionCategoryMappingRepo.findMany({
      where: {
        userId,
        categoryId: {
          in: categoryIds,
        },
      },
    });

    return TransactionCategoryMappingDto.createFromPlain(mappings);
  }

  async findAllByUserAndTransaction(
    userId: UserId,
    transactionId: string,
  ): Promise<TransactionCategoryMappingDto[]> {
    const mappings = await this.transactionCategoryMappingRepo.findMany({
      where: { userId, transactionId },
    });

    return TransactionCategoryMappingDto.createFromPlain(mappings);
  }

  async findMonthlySummariesByUserAndId(
    userId: UserId,
    categoryIds: string[],
    year?: number,
    month?: number,
  ): Promise<CategoryMonthlySummaryDto[]> {
    const allMappings = await this.transactionCategoryMappingRepo.findMany({
      where: {
        userId,
        categoryId: { in: categoryIds },
      },
      include: {
        transaction: {
          select: {
            date: true,
            fromAccount: true,
            toAccount: true,
          },
        },
      },
    });

    const filterDate = DateService.fromZonedTime(year, month - 1 || 0, 1);

    const filteredMappings = allMappings.filter(
      (mapping) =>
        (!year && !month) ||
        DateService.toZonedTime(mapping.transaction.date) >= filterDate,
    );

    const summaries = new Map<
      string,
      ForceMutable<CategoryMonthlySummaryDto>
    >();

    Array.from(
      Map.groupBy(filteredMappings, (mapping) => {
        const zonedDate = DateService.toZonedTime(mapping.transaction.date);

        const transactionMonth = zonedDate.getMonth() + 1;
        const transactionYear = zonedDate.getFullYear();

        let type: TransactionType;

        const hasToAccount = !!mapping.transaction.toAccount;
        const hasFromAccount = !!mapping.transaction.fromAccount;

        if (hasFromAccount && hasToAccount) {
          type = TransactionType.TRANSFER;
        } else if (hasFromAccount) {
          type = TransactionType.EXPENSE;
        } else {
          type = TransactionType.INCOME;
        }

        return {
          type,
          month: transactionMonth,
          year: transactionYear,
        };
      }).entries(),
    ).forEach(([key, value]) => {
      const { type, month: transactionMonth, year: transactionYear } = key;

      const count = value.length;
      const amount = value.reduce(
        (acc, transaction) => acc.add(transaction.amount),
        new Decimal(0),
      );

      const summary = summaries.get(
        `${transactionYear}-${transactionMonth}`,
      ) || {
        id: { month: transactionMonth, year: transactionYear },
        totalCount: 0,
        incomesCount: 0,
        expensesCount: 0,
        transfersCount: 0,
        totalAmount: new Decimal(0),
        incomeAmount: new Decimal(0),
        expenseAmount: new Decimal(0),
        transferAmount: new Decimal(0),
      };

      summary.totalCount += count;

      if (type === TransactionType.TRANSFER) {
        summary.transfersCount += count;
        summary.transferAmount = summary.transferAmount.add(amount);
      } else if (type === TransactionType.EXPENSE) {
        summary.expensesCount += count;
        summary.expenseAmount = summary.expenseAmount.add(amount);

        summary.totalAmount = summary.totalAmount.minus(amount);
      } else {
        summary.incomesCount += count;
        summary.incomeAmount = summary.incomeAmount.add(amount);

        summary.totalAmount = summary.totalAmount.add(amount);
      }

      summaries.set(`${transactionYear}-${transactionMonth}`, summary);
    });

    const monthlyData = Array.from(summaries.values())
      .sort((a, b) => {
        // Compare years first
        if (a.id.year > b.id.year) return -1;
        if (a.id.year < b.id.year) return 1;

        // If years are equal, compare months
        if (a.id.month > b.id.month) return -1;
        if (a.id.month < b.id.month) return 1;

        // If both year and month are equal, consider them equal in terms of sorting
        return 0;
      })
      .map((summary) => ({
        ...summary,
        totalAmount: summary.totalAmount,
        incomeAmount: summary.incomeAmount,
        expenseAmount: summary.expenseAmount,
        transferAmount: summary.transferAmount,
      }));

    return CategoryMonthlySummaryDto.createFromPlain(monthlyData);
  }

  update(id: number) {
    return `This action updates a #${id} transactionCategoryMapping`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionCategoryMapping`;
  }

  async removeAllByUserAndTransaction(userId: UserId, transactionId: string) {
    await this.transactionCategoryMappingRepo.deleteMany({
      userId,
      transactionId,
    });
  }

  removeAllByUser(userId: UserId) {
    return this.transactionCategoryMappingRepo.deleteMany({
      userId,
    });
  }
}
