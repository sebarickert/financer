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
    const newExpenseData = {
      ...createExpense,
      user: userId,
    };

    const newExpense = await this.transactionService.create(
      userId,
      newExpenseData as any,
    );

    await this.transactionService.updateTransactionHistoryAndAccount(
      userId,
      createExpense.fromAccount,
      createExpense.date,
      -createExpense.amount,
    );

    return newExpense;
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateExpenseDto,
  ) {
    const expenseBefore = await this.findOne(userId, id);

    const balanceBeforeCorrection =
      updateTransactionDto.fromAccount + '' ===
        expenseBefore.fromAccount + '' &&
      new Date(updateTransactionDto.date).getTime() >=
        expenseBefore.date.getTime()
        ? expenseBefore.amount
        : 0;

    const updatedExpense = await this.transactionService.update(
      userId,
      id,
      updateTransactionDto,
      { fromAccount: balanceBeforeCorrection },
    );

    await this.transactionService.updateTransactionHistoryAndAccount(
      userId,
      expenseBefore.fromAccount,
      expenseBefore.date,
      expenseBefore.amount,
    );

    await this.transactionService.updateTransactionHistoryAndAccount(
      userId,
      updatedExpense.fromAccount,
      updatedExpense.date,
      -updatedExpense.amount,
    );

    return updatedExpense;
  }

  async remove(userId: string, id: string) {
    const transaction = await this.findOne(userId, id);

    await this.transactionService.updateTransactionHistoryAndAccount(
      userId,
      transaction.fromAccount,
      transaction.date,
      transaction.amount,
    );

    await transaction.delete();
  }
}
