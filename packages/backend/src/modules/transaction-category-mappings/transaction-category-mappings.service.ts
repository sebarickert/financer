import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { CreateTransactionCategoryMappingDto } from './dto/create-transaction-category-mapping.dto';
import { TransactionCategoryMappingDto } from './dto/transaction-category-mapping.dto';

import { TransactionCategoryMappingRepo } from '@/database/repos/transaction-category-mapping.repo';
import { CategoryMonthlySummaryDto } from '@/transaction-categories/dto/transaction-month-summary.dto';
import { ForceMutable } from '@/types/force-mutable';
import { UserId } from '@/types/user-id';
import { DateService } from '@/utils/date.service';
import { sortDateDesc } from '@/utils/sort-helper';

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
      createTransactionCategoryMappingDto.map((category) => ({
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

  // eslint-disable-next-line max-lines-per-function, max-params
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

    const actualMonth = month ? month - 1 : 0;
    // @ts-expect-error - We are not using filter if year is empty
    const filterDate = DateService.fromZonedTime(year, actualMonth, 1);

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
      // eslint-disable-next-line max-statements
      Map.groupBy(filteredMappings, (mapping) => {
        const zonedDate = DateService.toZonedTime(mapping.transaction.date);

        const transactionMonth = zonedDate.getMonth() + 1;
        const transactionYear = zonedDate.getFullYear();

        // eslint-disable-next-line init-declarations
        let type: TransactionType;

        const hasToAccount = Boolean(mapping.transaction.toAccount);
        const hasFromAccount = Boolean(mapping.transaction.fromAccount);

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
      // eslint-disable-next-line max-statements
    ).forEach(([key, value]) => {
      const { type, month: transactionMonth, year: transactionYear } = key;

      const count = value.length;
      const amount = value.reduce(
        (acc, transaction) => acc.add(transaction.amount),
        new Decimal(0),
      );

      const summary = summaries.get(
        `${transactionYear}-${transactionMonth}`,
      ) ?? {
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
      .map((summary) => ({
        ...summary,
        idDate: new Date(summary.id.year, summary.id.month - 1),
      }))
      .sort(sortDateDesc('idDate'))
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
