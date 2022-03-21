import { Injectable } from '@nestjs/common';
import { TransactionDocument } from 'src/modules/transactions/schemas/transaction.schema';

import { AccountsService } from '../accounts/accounts.service';
import { TransactionsService } from '../transactions/transactions.service';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomesService {
  constructor(
    private transactionService: TransactionsService,
    private accountService: AccountsService,
  ) {}

  async findAllByUser(userId: string): Promise<TransactionDocument[]> {
    return this.transactionService.findAllIncomesByUser(userId);
  }

  async findOne(userId: string, id: string): Promise<TransactionDocument> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: string, createExpense: CreateIncomeDto) {
    const targetAccount = await this.accountService.findOne(
      userId,
      createExpense.toAccount as any,
    );

    const newIncomeData = {
      ...createExpense,
      user: userId,
      toAccountBalance: targetAccount.balance,
    };

    await this.updateTransactionHistoryAndAccount(
      userId,
      createExpense.toAccount,
      createExpense.date,
      createExpense.amount,
    );

    return this.transactionService.create(newIncomeData as any);
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateIncomeDto,
  ) {
    const incomeBefore = await this.findOne(userId, id);

    await this.updateTransactionHistoryAndAccount(
      userId,
      incomeBefore.toAccount,
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
      transaction.date,
      -transaction.amount,
    );

    await transaction.delete();
  }

  private async updateTransactionHistoryAndAccount(
    userId,
    accountId,
    date,
    amount,
  ): Promise<void> {
    await Promise.all([
      this.transactionService.updateAccountBalanceBeforeByAfterDate(
        accountId,
        date,
        amount,
      ),
      this.accountService.updateAccountBalance(userId, accountId, amount),
    ]);
  }
}
