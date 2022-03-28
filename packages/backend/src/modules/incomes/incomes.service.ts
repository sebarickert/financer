import { Injectable } from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
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

  async findAllByUser(userId: ObjectId): Promise<TransactionDocument[]> {
    return this.transactionService.findAllIncomesByUser(userId);
  }

  async findOne(userId: ObjectId, id: ObjectId): Promise<TransactionDocument> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: ObjectId, createExpense: CreateIncomeDto) {
    const newIncomeData = {
      ...createExpense,
      user: userId,
    };

    const newIncome = await this.transactionService.create(
      userId,
      newIncomeData,
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
    userId: ObjectId,
    id: ObjectId,
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

  async remove(userId: ObjectId, id: ObjectId) {
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
