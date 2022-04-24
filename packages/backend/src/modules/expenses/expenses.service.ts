import { PaginationDto, TransactionMonthSummaryDto } from '@local/types';
import { Injectable } from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import {
  TransactionsService,
  TransactionType,
} from '../transactions/transactions.service';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseDto } from './dto/expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private transactionService: TransactionsService) {}

  async findAllByUser(
    userId: ObjectId,
    page: number,
    limit: number,
    year: number,
    month: number,
  ): Promise<PaginationDto<ExpenseDto[]>> {
    return this.transactionService.findAllByUser(
      userId,
      TransactionType.EXPENSE,
      page || undefined,
      limit || undefined,
      year || undefined,
      month || undefined,
    );
  }

  async findMonthlySummariesByUser(
    userId: ObjectId,
  ): Promise<TransactionMonthSummaryDto[]> {
    return this.transactionService.findMonthlySummariesByUser(
      userId,
      TransactionType.EXPENSE,
    );
  }

  async findOne(userId: ObjectId, id: ObjectId): Promise<ExpenseDto> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: ObjectId, createExpense: CreateExpenseDto) {
    return this.transactionService.create(userId, createExpense);
  }

  async update(
    userId: ObjectId,
    id: ObjectId,
    updateTransactionDto: UpdateExpenseDto,
  ) {
    await this.findOne(userId, id);
    return this.transactionService.update(userId, id, updateTransactionDto);
  }

  async remove(userId: ObjectId, id: ObjectId) {
    const transaction = await this.findOne(userId, id);
    await this.transactionService.remove(transaction, userId);
  }
}
