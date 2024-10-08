import { Injectable } from '@nestjs/common';
import { AccountType, TransactionType } from '@prisma/client';

import { PaginationDto } from '../../types/pagination.dto';
import { TransactionsService } from '../transactions/transactions.service';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferDto } from './dto/transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(private transactionService: TransactionsService) {}

  async findAllByUser(
    userId: string,
    page: number,
    limit: number,
    year: number,
    month: number,
    accountTypes: AccountType[],
    accountId?: string,
  ): Promise<PaginationDto<TransferDto[]>> {
    return this.transactionService.findAllByUser(
      userId,
      TransactionType.TRANSFER,
      page || undefined,
      limit || undefined,
      year || undefined,
      month || undefined,
      accountId,
      accountTypes || undefined,
    );
  }

  async findOne(userId: string, id: string): Promise<TransferDto> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: string, createTransfer: CreateTransferDto) {
    return this.transactionService.create(userId, createTransfer);
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateTransferDto,
  ) {
    await this.findOne(userId, id);

    return this.transactionService.update(userId, id, updateTransactionDto);
  }

  async remove(userId: string, id: string) {
    const transaction = await this.findOne(userId, id);
    await this.transactionService.remove(transaction, userId);
  }
}
