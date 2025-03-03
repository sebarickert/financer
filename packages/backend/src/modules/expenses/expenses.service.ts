import { Injectable } from '@nestjs/common';
import { AccountType, Prisma, TransactionType } from '@prisma/client';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseDetailsDto } from './dto/expense-details.dto';
import { ExpenseListItemDto } from './dto/expense-list-item.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

import { TransactionsService } from '@/transactions/transactions.service';
import { UserId } from '@/types/user-id';

@Injectable()
export class ExpensesService {
  constructor(private readonly transactionService: TransactionsService) {}

  async findAllByUser(
    userId: UserId,
    limit: number,
    year: number,
    month: number,
    accountTypes?: AccountType[],
    accountId?: string,
    sortOrder?: Prisma.SortOrder,
  ): Promise<ExpenseListItemDto[]> {
    return this.transactionService.findAllByUser(
      userId,
      TransactionType.EXPENSE,
      limit || undefined,
      year || undefined,
      month || undefined,
      accountId,
      accountTypes ?? undefined,
      sortOrder ?? undefined,
    );
  }

  async findOne(userId: UserId, id: string): Promise<ExpenseDetailsDto> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: UserId, createExpense: CreateExpenseDto) {
    return this.transactionService.create(userId, createExpense);
  }

  async update(
    userId: UserId,
    id: string,
    updateTransactionDto: UpdateExpenseDto,
  ) {
    await this.findOne(userId, id);
    return this.transactionService.update(userId, id, updateTransactionDto);
  }

  async remove(userId: UserId, id: string) {
    const transaction = await this.findOne(userId, id);
    await this.transactionService.remove(transaction, userId);
  }
}
