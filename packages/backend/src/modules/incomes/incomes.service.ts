import { Injectable } from '@nestjs/common';
import { AccountType, Prisma, TransactionType } from '@prisma/client';

import { CreateIncomeDto } from './dto/create-income.dto';
import { IncomeDetailsDto } from './dto/income-details.dto';
import { IncomeListItemDto } from './dto/income-list-item.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

import { TransactionsService } from '@/transactions/transactions.service';
import { UserId } from '@/types/user-id';

@Injectable()
export class IncomesService {
  constructor(private readonly transactionService: TransactionsService) {}

  async findAllByUser(
    userId: UserId,
    page: number,
    limit: number,
    year: number,
    month: number,
    accountTypes?: AccountType[],
    accountId?: string,
    sortOrder?: Prisma.SortOrder,
  ): Promise<IncomeListItemDto[]> {
    return this.transactionService.findAllByUser(
      userId,
      TransactionType.INCOME,
      limit || undefined,
      year || undefined,
      month || undefined,
      accountId,
      accountTypes ?? undefined,
      sortOrder ?? undefined,
    );
  }

  async findOne(userId: UserId, id: string): Promise<IncomeDetailsDto> {
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
