import { Injectable } from '@nestjs/common';

import { AccountsService } from '../accounts/accounts.service';
import { TransactionDocument } from '../transactions/schemas/transaction.schema';
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
    const newIncomeData = {
      ...createExpense,
      user: userId,
    };

    const newIncome = await this.transactionService.create(
      userId,
      newIncomeData as any,
    );

    await this.transactionService.updateTransactionHistoryAndAccount(
      userId,
      createExpense.toAccount,
      createExpense.date,
      createExpense.amount,
    );

    return newIncome;
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateIncomeDto,
  ) {
    const incomeBefore = await this.findOne(userId, id);

    const balanceBeforeCorrection =
      updateTransactionDto.toAccount + '' === incomeBefore.toAccount + '' &&
      new Date(updateTransactionDto.date).getTime() >=
        incomeBefore.date.getTime()
        ? incomeBefore.amount
        : 0;

    const updatedIncome = await this.transactionService.update(
      userId,
      id,
      updateTransactionDto,
      { toAccount: balanceBeforeCorrection },
    );

    await this.transactionService.updateTransactionHistoryAndAccount(
      userId,
      incomeBefore.toAccount,
      incomeBefore.date,
      -incomeBefore.amount,
    );

    await this.transactionService.updateTransactionHistoryAndAccount(
      userId,
      updatedIncome.toAccount,
      updatedIncome.date,
      updatedIncome.amount,
    );

    return updatedIncome;
  }

  async remove(userId: string, id: string) {
    const transaction = await this.findOne(userId, id);

    await this.transactionService.updateTransactionHistoryAndAccount(
      userId,
      transaction.toAccount,
      transaction.date,
      -transaction.amount,
    );

    await transaction.delete();
  }
}
