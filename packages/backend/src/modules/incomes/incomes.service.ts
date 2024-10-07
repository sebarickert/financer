import { Injectable } from '@nestjs/common';
import { AccountType, TransactionType } from '@prisma/client';

import { PaginationDto } from '../../types/pagination.dto';
import { UserId } from '../../types/user-id';
import { TransactionsService } from '../transactions/transactions.service';

import { CreateIncomeDto } from './dto/create-income.dto';
import { IncomeDto } from './dto/income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomesService {
  constructor(private readonly transactionService: TransactionsService) {}

  async findAllByUser(
    userId: UserId,
    page: number,
    limit: number,
    year: number,
    month: number,
    accountTypes: AccountType[],
    accountId?: string,
  ): Promise<PaginationDto<IncomeDto[]>> {
    return this.transactionService.findAllByUser(
      userId,
      TransactionType.INCOME,
      page || undefined,
      limit || undefined,
      year || undefined,
      month || undefined,
      accountId,
      accountTypes || undefined,
    );
  }

  async findOne(userId: UserId, id: string): Promise<IncomeDto> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: UserId, createExpense: CreateIncomeDto) {
    return this.transactionService.create(userId, createExpense);
  }

  async update(
    userId: UserId,
    id: string,
    updateTransactionDto: UpdateIncomeDto,
  ) {
    await this.findOne(userId, id);
    return this.transactionService.update(userId, id, updateTransactionDto);
  }

  async remove(userId: UserId, id: string) {
    const transaction = await this.findOne(userId, id);
    await this.transactionService.remove(transaction, userId);
  }
}
