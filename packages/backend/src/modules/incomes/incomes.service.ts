import { Injectable } from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { TransactionDocument } from '../transactions/schemas/transaction.schema';
import { TransactionsService } from '../transactions/transactions.service';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomesService {
  constructor(private transactionService: TransactionsService) {}

  async findAllByUser(userId: ObjectId): Promise<TransactionDocument[]> {
    return this.transactionService.findAllIncomesByUser(userId);
  }

  async findOne(userId: ObjectId, id: ObjectId): Promise<TransactionDocument> {
    return this.transactionService.findOne(userId, id);
  }

  async create(userId: ObjectId, createExpense: CreateIncomeDto) {
    return this.transactionService.create(userId, createExpense);
  }

  async update(
    userId: ObjectId,
    id: ObjectId,
    updateTransactionDto: UpdateIncomeDto,
  ) {
    await this.findOne(userId, id);
    return this.transactionService.update(userId, id, updateTransactionDto);
  }

  async remove(userId: ObjectId, id: ObjectId) {
    const transaction = await this.findOne(userId, id);
    await this.transactionService.remove(transaction, userId);
  }
}
