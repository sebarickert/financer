import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction-category.dto';
import {
  TransactionCategory,
  TransactionCategoryDocument,
} from './schemas/transaction-category.schema';

@Injectable()
export class TransactionCategoriesService {
  constructor(
    @InjectModel(TransactionCategory.name)
    private transactionCategoryModel: Model<TransactionCategoryDocument>,
  ) {}

  create(createTransactionCategoryDto: CreateTransactionCategoryDto) {
    return 'This action adds a new transactionCategory';
  }

  findAll() {
    return `This action returns all transactionCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionCategory`;
  }

  async findAllByUser(userId: string): Promise<TransactionCategoryDocument[]> {
    return this.transactionCategoryModel.find({ owner: userId }).exec();
  }

  update(
    id: number,
    updateTransactionCategoryDto: UpdateTransactionCategoryDto,
  ) {
    return `This action updates a #${id} transactionCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionCategory`;
  }
}
