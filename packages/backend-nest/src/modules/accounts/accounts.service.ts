import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument } from 'src/modules/accounts/schemas/account.schema';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async create(
    userId: string,
    createAccountDto: CreateAccountDto,
  ): Promise<AccountDocument> {
    return this.accountModel.create({ ...createAccountDto, owner: userId });
  }

  async createMany(
    createAccountDto: CreateAccountDto[],
  ): Promise<AccountDocument[]> {
    return this.accountModel.insertMany(createAccountDto);
  }

  async findOne(userId: string, id: string): Promise<AccountDocument> {
    const account = await this.accountModel.findOne({ _id: id });

    if (!account) {
      throw new NotFoundException('Account not found.');
    } else if (account.owner + '' !== (userId as any)) {
      throw new UnauthorizedException('Unauthorized to access this account.');
    }

    return account;
  }

  async findAllByUser(userId: string): Promise<AccountDocument[]> {
    return this.accountModel.find({ owner: userId });
  }

  async update(
    userId: string,
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDocument> {
    await this.findOne(userId, id);

    return this.accountModel.findByIdAndUpdate(id, updateAccountDto).exec();
  }

  async updateAccountBalance(
    userId: string,
    id: string,
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

  async removeAllByUser(userId: string) {
    return this.accountModel.deleteMany({ owner: userId }).exec();
  }
}
