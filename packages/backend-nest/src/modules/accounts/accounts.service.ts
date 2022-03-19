import { Injectable } from '@nestjs/common';
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

  create(createAccountDto: CreateAccountDto) {
    return 'This action adds a new account';
  }

  async createMany(createAccountDto: CreateAccountDto[]) {
    return this.accountModel.insertMany(createAccountDto);
  }

  findAll() {
    return `This action returns all accounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  async findAllByUser(userId: string): Promise<AccountDocument[]> {
    return this.accountModel.find({ owner: userId });
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  async removeAllByUser(userId: string) {
    return this.accountModel.deleteMany({ owner: userId }).exec();
  }
}
