import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ObjectId } from '../../types/objectId';

import { CreateAccountBalanceChangeDto } from './dto/create-account-balance-change.dto';
import {
  AccountBalanceChange,
  AccountBalanceChangeDocument,
} from './schemas/account-balance-change.schema';

@Injectable()
export class AccountBalanceChangesService {
  constructor(
    @InjectModel(AccountBalanceChange.name)
    private accountBalanceChangeModel: Model<AccountBalanceChangeDocument>,
  ) {}

  async create(
    createAccountBalanceChange: CreateAccountBalanceChangeDto,
  ): Promise<AccountBalanceChangeDocument> {
    return this.accountBalanceChangeModel.create(createAccountBalanceChange);
  }

  async createMany(
    createAccountBalanceChanges: CreateAccountBalanceChangeDto[],
  ): Promise<AccountBalanceChangeDocument[]> {
    return this.accountBalanceChangeModel.insertMany(
      createAccountBalanceChanges,
    );
  }

  async findAllByUser(
    userId: ObjectId,
  ): Promise<AccountBalanceChangeDocument[]> {
    return this.accountBalanceChangeModel.find({ userId });
  }

  async findAllByUserAndAccount(
    userId: ObjectId,
    accountId: ObjectId,
  ): Promise<AccountBalanceChangeDocument[]> {
    return this.accountBalanceChangeModel.find({ userId, accountId });
  }

  async removeAllByUser(userId: ObjectId): Promise<void> {
    await this.accountBalanceChangeModel.deleteMany({ userId });
  }
}
