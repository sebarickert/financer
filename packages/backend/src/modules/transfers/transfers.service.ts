import { Injectable } from '@nestjs/common';
import { AccountType, Prisma, TransactionType } from '@prisma/client';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferDetailsDto } from './dto/transfer-details.dto';
import { TransferListItemDto } from './dto/transfer-list-item.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

import { TransactionsService } from '@/transactions/transactions.service';
import { UserId } from '@/types/user-id';

@Injectable()
export class TransfersService {
  constructor(private readonly transactionService: TransactionsService) {}

  // eslint-disable-next-line max-params
  async findAllByUser(
    userId: UserId,
    page: number,
    limit: number,
    year: number,
    month: number,
    accountTypes?: AccountType[],
    accountId?: string,
    sortOrder?: Prisma.SortOrder,
  ): Promise<TransferListItemDto[]> {
    return this.transactionService.findAllByUser(
      userId,
      TransactionType.TRANSFER,
      limit || undefined,
      year || undefined,
      month || undefined,
      accountId,
      accountTypes ?? undefined,
      sortOrder ?? undefined,
    );
  }

  async findOne(userId: UserId, id: string): Promise<TransferDetailsDto> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: UserId, createTransfer: CreateTransferDto) {
    return this.transactionService.create(userId, createTransfer);
  }

  async update(
    userId: UserId,
    id: string,
    updateTransactionDto: UpdateTransferDto,
  ) {
    await this.findOne(userId, id);

    return this.transactionService.update(userId, id, updateTransactionDto);
  }

  async remove(userId: UserId, id: string) {
    const transaction = await this.findOne(userId, id);
    await this.transactionService.remove(transaction, userId);
  }
}
