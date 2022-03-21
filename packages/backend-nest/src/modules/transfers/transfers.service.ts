import { Injectable } from '@nestjs/common';

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

  async findAllByUser(userId: string): Promise<TransactionDocument[]> {
    return this.transactionService.findAllTransfersByUser(userId);
  }

  async findOne(userId: string, id: string): Promise<TransactionDocument> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: string, createTransfer: CreateTransferDto) {
    const targetToAccount = await this.accountService.findOne(
      userId,
      createTransfer.toAccount as any,
    );
    const targetFromAccount = await this.accountService.findOne(
      userId,
      createTransfer.fromAccount as any,
    );

    const newTransferData = {
      ...createTransfer,
      user: userId,
      toAccountBalance: targetToAccount.balance,
      fromAccountBalance: targetFromAccount.balance,
    };

    await this.updateTransactionHistoryAndAccount(
      userId,
      createTransfer.toAccount,
      createTransfer.fromAccount,
      createTransfer.date,
      createTransfer.amount,
    );

    return this.transactionService.create(newTransferData as any);
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateTransferDto,
  ) {
    const incomeBefore = await this.findOne(userId, id);
    await this.updateTransactionHistoryAndAccount(
      userId,
      incomeBefore.toAccount,
      incomeBefore.fromAccount,
      incomeBefore.date,
      -incomeBefore.amount,
    );

    const updatedIncome = await this.transactionService.update(
      userId,
      id,
      updateTransactionDto,
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

  async remove(userId: string, id: string) {
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
      this.transactionService.updateAccountBalanceBeforeByAfterDate(
        toAccountId,
        date,
        amount,
      ),
      this.transactionService.updateAccountBalanceBeforeByAfterDate(
        fromAccountId,
        date,
        -amount,
      ),
      this.accountService.updateAccountBalance(userId, toAccountId, amount),
      this.accountService.updateAccountBalance(userId, fromAccountId, -amount),
    ]);
  }
}
