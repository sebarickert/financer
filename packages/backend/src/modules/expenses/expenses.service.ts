import { Injectable } from '@nestjs/common';
import { AccountType, TransactionType } from '@prisma/client';

import { PaginationDto } from '../../types/pagination.dto';
import { TransactionsService } from '../transactions/transactions.service';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseDto } from './dto/expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private transactionService: TransactionsService) {}

  async findAllByUser(
    userId: string,
    page: number,
    limit: number,
    year: number,
    month: number,
    accountTypes: AccountType[],
    accountId?: string,
  ): Promise<PaginationDto<ExpenseDto[]>> {
    return this.transactionService.findAllByUser(
      userId,
      TransactionType.EXPENSE,
      page || undefined,
      limit || undefined,
      year || undefined,
      month || undefined,
      accountId,
      accountTypes || undefined,
    );
  }

  async findOne(userId: string, id: string): Promise<ExpenseDto> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: string, createExpense: CreateExpenseDto) {
    return this.transactionService.create(userId, createExpense);
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateExpenseDto,
  ) {
    await this.findOne(userId, id);
    return this.transactionService.update(userId, id, updateTransactionDto);
  }

  async remove(userId: string, id: string) {
    const transaction = await this.findOne(userId, id);
    await this.transactionService.remove(transaction, userId);
  }
}
