import { Injectable } from '@nestjs/common';
import { AccountType, TransactionType } from '@prisma/client';

import { PaginationDto } from '../../types/pagination.dto';
import { UserId } from '../../types/user-id';
import { TransactionsService } from '../transactions/transactions.service';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseDetailsDto } from './dto/expense-details.dto';
import { ExpenseListItemDto } from './dto/expense-list-item.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private transactionService: TransactionsService) {}

  async findAllByUser(
    userId: UserId,
    page: number,
    limit: number,
    year: number,
    month: number,
    accountTypes: AccountType[],
    accountId?: string,
  ): Promise<PaginationDto<ExpenseListItemDto[]>> {
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
