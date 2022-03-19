import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionDocument,
} from 'src/modules/transactions/schemas/transaction.schema';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  async createMany(createTransactionDto: CreateTransactionDto[]) {
    return this.transactionModel.insertMany(createTransactionDto);
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async findAllByUser(userId: string): Promise<TransactionDocument[]> {
    return this.transactionModel.find({ owner: userId }).exec();
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async removeAllByUser(userId: string) {
    return this.transactionModel.deleteMany({ owner: userId }).exec();
  }

  async findAllIncomesByUser(userId: string): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({
        owner: userId,
        toAccount: { $ne: undefined },
        fromAccount: { $eq: undefined },
      })
      .exec();
  }

  async findAllExpensesByUser(userId: string): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({
        owner: userId,
        fromAccount: { $ne: undefined },
        toAccount: { $eq: undefined },
      })
      .exec();
  }

  async findAllTransfersByUser(userId: string): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({
        owner: userId,
        fromAccount: { $ne: undefined },
        toAccount: { $ne: undefined },
      })
      .exec();
  }
}
