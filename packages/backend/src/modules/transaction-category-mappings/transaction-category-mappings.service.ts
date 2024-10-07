import { BadRequestException, Injectable } from '@nestjs/common';
import {
  TransactionCategoryMapping,
  TransactionType,
  Prisma,
} from '@prisma/client';

import { TransactionCategoryMappingRepo } from '../../database/repos/transaction-category-mapping.repo';
import { ForceMutable } from '../../types/force-mutable';
import { DateService } from '../../utils/date.service';
import { CategoryMonthlySummaryDto } from '../transaction-categories/dto/transaction-month-summary.dto';

import { CreateTransactionCategoryMappingDto } from './dto/create-transaction-category-mapping.dto';

@Injectable()
export class TransactionCategoryMappingsService {
  constructor(
    private readonly transactionCategoryMappingRepo: TransactionCategoryMappingRepo,
  ) {}

  async createMany(
    userId: string,
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

  async findAllByUser(userId: string): Promise<TransactionCategoryMapping[]> {
    return this.transactionCategoryMappingRepo.findMany({ where: { userId } });
  }

  async findAllByUserAndCategoryIds(
    userId: string,
    categoryIds: string[],
  ): Promise<TransactionCategoryMapping[]> {
    return this.transactionCategoryMappingRepo.findMany({
      where: {
        userId,
        categoryId: {
          in: categoryIds,
        },
      },
    });
  }

  async findAllByUserAndTransaction(
    userId: string,
    transactionId: string,
  ): Promise<TransactionCategoryMapping[]> {
    return this.transactionCategoryMappingRepo.findMany({
      where: { userId, transactionId },
    });
  }

  async findMonthlySummariesByUserAndId(
    userId: string,
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
      const amount = value.reduce((acc, mapping) => acc + mapping.amount, 0);

      const summary = summaries.get(
        `${transactionYear}-${transactionMonth}`,
      ) || {
        id: { month: transactionMonth, year: transactionYear },
        totalCount: 0,
        incomesCount: 0,
        expensesCount: 0,
        transfersCount: 0,
        totalAmount: 0,
        incomeAmount: 0,
        expenseAmount: 0,
        transferAmount: 0,
      };

      summary.totalCount += count;

      if (type === TransactionType.TRANSFER) {
        summary.transfersCount += count;
        summary.transferAmount += amount;
      } else if (type === TransactionType.EXPENSE) {
        summary.expensesCount += count;
        summary.expenseAmount += amount;

        summary.totalAmount -= amount;
      } else {
        summary.incomesCount += count;
        summary.incomeAmount += amount;

        summary.totalAmount += amount;
      }

      summaries.set(`${transactionYear}-${transactionMonth}`, summary);
    });

    return Array.from(summaries.values())
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
        totalAmount: Number(summary.totalAmount.toFixed(2)),
        incomeAmount: Number(summary.incomeAmount.toFixed(2)),
        expenseAmount: Number(summary.expenseAmount.toFixed(2)),
        transferAmount: Number(summary.transferAmount.toFixed(2)),
      }));
  }

  private filterRawMongoYearAndMonthFilter(
    year?: number,
    month?: number,
    filterMode: 'targetMonth' | 'laterThan' = 'targetMonth',
  ): Prisma.InputJsonObject {
    if (!year && month) {
      throw new BadRequestException('Year is required when month is provided');
    }

    if (!year && !month) {
      return {};
    }

    if (filterMode === 'laterThan') {
      return {
        date: {
          $gte: DateService.fromZonedTime(year, month - 1 || 0, 1),
        },
      };
    }

    return {
      date: {
        $gte: DateService.fromZonedTime(year, month - 1 || 0, 1),
        $lt: DateService.fromZonedTime(year, month || 12, 1),
      },
    };
  }

  private filterRawMongoMonthlySummaryCondition(
    userId: string,
    operator: '$amount' | '$transactionAmount' | 1 | 0,
    transactionType: TransactionType,
  ): Prisma.InputJsonValue {
    const selectedQuery =
      this.filterRawMongoAggregationTransactionTypeFilter(transactionType);

    if (transactionType !== null || typeof operator !== 'string') {
      return { $cond: [{ $and: selectedQuery }, operator, 0] };
    }

    return {
      $cond: [
        { $and: [...selectedQuery, { $eq: ['$fromAccount', null] }] },
        operator,
        {
          $cond: [
            { $and: [...selectedQuery, { $eq: ['$toAccount', null] }] },
            { $multiply: [operator, -1] },
            0,
          ],
        },
      ],
    };
  }

  private filterRawMongoAggregationTransactionTypeFilter(
    transactionType: TransactionType,
  ): Prisma.InputJsonObject[] {
    const isEmpty = (fieldName: string) => ({ $eq: [fieldName, null] });
    const isNotEmpty = (fieldName: string) => ({ $ne: [fieldName, null] });

    switch (transactionType) {
      case TransactionType.INCOME:
        return [isNotEmpty('$toAccount'), isEmpty('$fromAccount')];
      case TransactionType.EXPENSE:
        return [isNotEmpty('$fromAccount'), isEmpty('$toAccount')];
      case TransactionType.TRANSFER:
        return [isNotEmpty('$fromAccount'), isNotEmpty('$toAccount')];
      case null:
        return [];
      default:
        throw new Error(`Invalid transaction type: ${transactionType}`);
    }
  }

  update(id: number) {
    return `This action updates a #${id} transactionCategoryMapping`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionCategoryMapping`;
  }

  async removeAllByUserAndTransaction(userId: string, transactionId: string) {
    await this.transactionCategoryMappingRepo.deleteMany({
      userId,
      transactionId,
    });
  }

  async removeAllByUser(userId: string) {
    await this.transactionCategoryMappingRepo.deleteMany({
      userId,
    });
  }
}
