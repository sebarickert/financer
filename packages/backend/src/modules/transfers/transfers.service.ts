import { Injectable } from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionDocument } from '../transactions/schemas/transaction.schema';
import { TransactionsService } from '../transactions/transactions.service';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(
    private transactionService: TransactionsService,
    private accountService: AccountsService,
  ) {}

  async findAllByUser(userId: ObjectId): Promise<TransactionDocument[]> {
    return this.transactionService.findAllTransfersByUser(userId);
  }

  async findOne(userId: ObjectId, id: ObjectId): Promise<TransactionDocument> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: ObjectId, createTransfer: CreateTransferDto) {
    const newTransferData = {
      ...createTransfer,
      user: userId,
    };

    const newTransfer = await this.transactionService.create(
      userId,
      newTransferData,
    );

    await this.updateTransactionHistoryAndAccount(
      userId,
      createTransfer.toAccount,
      createTransfer.fromAccount,
      createTransfer.date,
      createTransfer.amount,
    );

    return newTransfer;
  }

  async update(
    userId: ObjectId,
    id: ObjectId,
    updateTransactionDto: UpdateTransferDto,
  ) {
    const transferBefore = await this.findOne(userId, id);

    const toAccountBalanceBeforeCorrection =
      updateTransactionDto.toAccount + '' === transferBefore.toAccount + '' &&
      new Date(updateTransactionDto.date).getTime() >=
        transferBefore.date.getTime()
        ? transferBefore.amount
        : 0;

    const fromAccountBalanceBeforeCorrection =
      updateTransactionDto.fromAccount + '' ===
        transferBefore.fromAccount + '' &&
      new Date(updateTransactionDto.date).getTime() >=
        transferBefore.date.getTime()
        ? transferBefore.amount
        : 0;

    const updatedIncome = await this.transactionService.update(
      userId,
      id,
      updateTransactionDto,
      {
        toAccount: toAccountBalanceBeforeCorrection,
        fromAccount: fromAccountBalanceBeforeCorrection,
      },
    );

    await this.updateTransactionHistoryAndAccount(
      userId,
      transferBefore.toAccount,
      transferBefore.fromAccount,
      transferBefore.date,
      -transferBefore.amount,
    );

    await this.updateTransactionHistoryAndAccount(
      userId,
      updatedIncome.toAccount,
      updatedIncome.fromAccount,
      updatedIncome.date,
      updatedIncome.amount,
    );

    return updatedIncome;
  }

  async remove(userId: ObjectId, id: ObjectId) {
    const transaction = await this.findOne(userId, id);

    await this.updateTransactionHistoryAndAccount(
      userId,
      transaction.toAccount,
      transaction.fromAccount,
      transaction.date,
      -transaction.amount,
    );

    await transaction.delete();
  }

  private async updateTransactionHistoryAndAccount(
    userId,
    toAccountId,
    fromAccountId,
    date,
    amount,
  ): Promise<void> {
    await Promise.all([
      this.transactionService.updateTransactionHistoryAndAccount(
        userId,
        toAccountId,
        date,
        amount,
      ),
      this.transactionService.updateTransactionHistoryAndAccount(
        userId,
        fromAccountId,
        date,
        -amount,
      ),
    ]);
  }
}
