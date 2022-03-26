import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTransactionCategoryMappingDto } from './dto/create-transaction-category-mapping.dto';
import { UpdateTransactionCategoryMappingDto } from './dto/update-transaction-category-mapping.dto';
import {
  TransactionCategoryMapping,
  TransactionCategoryMappingDocument,
} from './schemas/transaction-category-mapping.schema';

@Injectable()
export class TransactionCategoryMappingsService {
  constructor(
    @InjectModel(TransactionCategoryMapping.name)
    private transactionCategoryMappingModel: Model<TransactionCategoryMappingDocument>,
  ) {}

  create(
    createTransactionCategoryMappingDto: CreateTransactionCategoryMappingDto,
  ) {
    return 'This action adds a new transactionCategoryMapping';
  }

  async createMany(
    createTransactionCategoryMappingDto: CreateTransactionCategoryMappingDto[],
  ) {
    return this.transactionCategoryMappingModel.insertMany(
      createTransactionCategoryMappingDto,
    );
  }

  findAll() {
    return `This action returns all transactionCategoryMappings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionCategoryMapping`;
  }

  async findAllByUser(
    userId: string,
  ): Promise<TransactionCategoryMappingDocument[]> {
    return this.transactionCategoryMappingModel.find({ owner: userId }).exec();
  }

  update(
    id: number,
    updateTransactionCategoryMappingDto: UpdateTransactionCategoryMappingDto,
  ) {
    return `This action updates a #${id} transactionCategoryMapping`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionCategoryMapping`;
  }

  async removeAllByUserAndTransaction(userId: string, transactionId: string) {
    await this.transactionCategoryMappingModel
      .deleteMany({
        owner: userId,
        transaction_id: transactionId,
      })
      .exec();
  }

  async removeAllByUser(userId: string) {
    await this.transactionCategoryMappingModel
      .deleteMany({
        owner: userId,
      })
      .exec();
  }
}
