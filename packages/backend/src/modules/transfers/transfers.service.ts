import { PaginationDto, TransactionMonthSummaryDto } from '@local/types';
import { Injectable } from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import {
  TransactionsService,
  TransactionType,
} from '../transactions/transactions.service';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferDto } from './dto/transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(private transactionService: TransactionsService) {}

  async findAllByUser(
    userId: ObjectId,
    page: number,
    limit: number,
    year: number,
    month: number,
  ): Promise<PaginationDto<TransferDto[]>> {
    return this.transactionService.findAllByUser(
      userId,
      TransactionType.TRANSFER,
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
      TransactionType.TRANSFER,
    );
  }

  async findOne(userId: ObjectId, id: ObjectId): Promise<TransferDto> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: ObjectId, createTransfer: CreateTransferDto) {
    return this.transactionService.create(userId, createTransfer);
  }

  async update(
    userId: ObjectId,
    id: ObjectId,
    updateTransactionDto: UpdateTransferDto,
  ) {
    await this.findOne(userId, id);

    return this.transactionService.update(userId, id, updateTransactionDto);
  }

  async remove(userId: ObjectId, id: ObjectId) {
    const transaction = await this.findOne(userId, id);
    await this.transactionService.remove(transaction, userId);
  }
}
