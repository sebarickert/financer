import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ObjectId } from '../../types/objectId';
import { TransactionCategory } from '../transaction-categories/schemas/transaction-category.schema';
import { User } from '../users/schemas/user.schema';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async create(
    userId: ObjectId,
    createAccountDto: CreateAccountDto,
  ): Promise<AccountDocument> {
    return this.accountModel.create({ ...createAccountDto, owner: userId });
  }

  async createMany(
    createAccountDto: CreateAccountDto[],
  ): Promise<AccountDocument[]> {
    return this.accountModel.insertMany(createAccountDto);
  }

  async findOne(userId: ObjectId, id: ObjectId): Promise<AccountDocument> {
    const account = await this.accountModel.findOne({ _id: id });

    if (!account) {
      throw new NotFoundException('Account not found.');
    } else if (!account.owner.equals(userId)) {
      throw new UnauthorizedException('Unauthorized to access this account.');
    }

    return account;
  }

  async findAllByUser(userId: ObjectId): Promise<AccountDocument[]> {
    return this.accountModel.find({ owner: userId });
  }

  async update(
    userId: ObjectId,
    id: ObjectId,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDocument> {
    await this.findOne(userId, id);

    return this.accountModel.findByIdAndUpdate(id, updateAccountDto).exec();
  }

  async updateAccountBalance(
    userId: ObjectId,
    id: ObjectId,
    amount: number,
  ): Promise<AccountDocument> {
    await this.findOne(userId, id);

    return this.accountModel
      .findByIdAndUpdate(
        id,
        {
          $inc: { balance: amount },
        },
        { new: true },
      )
      .exec();
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  async removeAllByUser(userId: ObjectId) {
    await this.accountModel.deleteMany({ owner: userId }).exec();
  }
}
