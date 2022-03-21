import { Injectable } from '@nestjs/common';

import { AccountsService } from '../accounts/accounts.service';
import { TransactionDocument } from '../transactions/schemas/transaction.schema';
import { TransactionsService } from '../transactions/transactions.service';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    private transactionService: TransactionsService,
    private accountService: AccountsService,
  ) {}

  async findAllByUser(userId: string): Promise<TransactionDocument[]> {
    return this.transactionService.findAllExpensesByUser(userId);
  }

  async findOne(userId: string, id: string): Promise<TransactionDocument> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: string, createExpense: CreateExpenseDto) {
    const targetAccount = await this.accountService.findOne(
      userId,
      createExpense.fromAccount as any,
    );

    const newExpenseData = {
      ...createExpense,
      user: userId,
      fromAccountBalance: targetAccount.balance,
    };

    await this.updateTransactionHistoryAndAccount(
      userId,
      createExpense.fromAccount,
      createExpense.date,
      -createExpense.amount,
    );

    return this.transactionService.create(newExpenseData as any);
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateExpenseDto,
  ) {
    const expenseBefore = await this.findOne(userId, id);
    await this.updateTransactionHistoryAndAccount(
      userId,
      expenseBefore.fromAccount,
      expenseBefore.date,
      expenseBefore.amount,
    );

    const updatedExpense = await this.transactionService.update(
      userId,
      id,
      updateTransactionDto,
    );

    await this.updateTransactionHistoryAndAccount(
      userId,
      updatedExpense.fromAccount,
      updatedExpense.date,
      -updatedExpense.amount,
    );

    return updatedExpense;
  }

  async remove(userId: string, id: string) {
    const transaction = await this.findOne(userId, id);

    await this.updateTransactionHistoryAndAccount(
      userId,
      transaction.fromAccount,
      transaction.date,
      transaction.amount,
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
