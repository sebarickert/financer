import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ObjectId } from '../../types/objectId';

import { CreateTransactionTemplateDto } from './dto/create-transaction-template.dto';
import { UpdateTransactionTemplateDto } from './dto/update-transaction-template.dto';
import {
  TransactionTemplate,
  TransactionTemplateDocument,
} from './schemas/transaction-template.schema';

@Injectable()
export class TransactionTemplateService {
  constructor(
    @InjectModel(TransactionTemplate.name)
    private transactionTemplateModel: Model<TransactionTemplateDocument>,
  ) {}

  async create(
    createTransactionTemplateDto: CreateTransactionTemplateDto,
    userId: ObjectId,
  ) {
    return this.transactionTemplateModel.create({
      ...createTransactionTemplateDto,
      userId,
    });
  }

  async createMany(
    createTransactionTemplateDto: CreateTransactionTemplateDto[],
  ) {
    return this.transactionTemplateModel.insertMany(
      createTransactionTemplateDto,
    );
  }

  async findAllByUser(userId: ObjectId) {
    return this.transactionTemplateModel.find({ userId });
  }

  async findOne(id: ObjectId, userId: ObjectId) {
    const template = await this.transactionTemplateModel.findOne({ _id: id });

    if (!template) {
      throw new NotFoundException('Account not found.');
    } else if (!template.userId.equals(userId)) {
      throw new UnauthorizedException(
        'Unauthorized to access this transaction template.',
      );
    }
  }

  async update(
    id: ObjectId,
    updateTransactionTemplateDto: UpdateTransactionTemplateDto,
    userId: ObjectId,
  ) {
    await this.findOne(id, userId);
    return this.transactionTemplateModel.updateOne(
      { _id: id },
      updateTransactionTemplateDto,
      {
        new: true,
      },
    );
  }

  async remove(id: ObjectId, userId: ObjectId) {
    await this.findOne(id, userId);
    return this.transactionTemplateModel.deleteOne({ _id: id });
  }

  async removeAllByUser(userId: ObjectId) {
    await this.transactionTemplateModel.deleteMany({ userId }).exec();
  }
}
