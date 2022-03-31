import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ObjectId } from '../../types/objectId';
import { sumArrayItems } from '../../utils/arrays';
import { AccountBalanceChangesService } from '../account-balance-changes/account-balance-changes.service';
import { TransactionsService } from '../transactions/transactions.service';

import { AccountBalanceHistoryDto } from './dto/account-balance-history.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private accountBalanceChangesService: AccountBalanceChangesService,
    @Inject(forwardRef(() => TransactionsService))
    private transactionsService: TransactionsService,
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
    const accountBeforeChange = await this.findOne(userId, id);

    if (
      updateAccountDto.balance &&
      updateAccountDto.balance !== accountBeforeChange.balance
    ) {
      const balanceChangeAmount =
        updateAccountDto.balance - accountBeforeChange.balance;
      await this.accountBalanceChangesService.create({
        accountId: id,
        userId,
        amount: balanceChangeAmount,
        date: new Date(),
      });
    }

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

  async getAccountBalanceHistory(
    userId: ObjectId,
    accountId: ObjectId,
  ): Promise<AccountBalanceHistoryDto[]> {
    const account = await this.findOne(userId, accountId);

    const accountBalanceChanges = (
      await this.accountBalanceChangesService.findAllByUserAndAccount(
        userId,
        accountId,
      )
    ).map(({ amount, date }) => ({ amount, date }));

    const accountTransactions = (
      await this.transactionsService.findAllByAccount(userId, accountId)
    ).map(({ amount, date, toAccount }) => ({
      date,
      amount: accountId.equals(toAccount) ? amount : -amount,
    }));

    const allBalanceChanges = accountBalanceChanges.concat(accountTransactions);

    const summarizedBalanceChanges = allBalanceChanges
      .reduce(
        (previous, { date }) =>
          previous.some((d) => d.getTime() === date.getTime())
            ? previous
            : previous.concat(date),
        [] as Date[],
      )
      .sort((a, b) => b.getTime() - a.getTime())
      .map((date) => {
        const balanceChangeAmounts = allBalanceChanges
          .filter(({ date: itemDate }) => itemDate.getTime() === date.getTime())
          .map(({ amount }) => amount);

        return {
          date,
          amount: sumArrayItems(balanceChangeAmounts),
        };
      })
      .reduce((previous, { date, amount }) => {
        const previousBalance = previous.at(-1)?.balance ?? account.balance;

        const previousAmount = previous.at(-1)?.amount ?? 0;

        const newBalance = previousBalance - previousAmount;

        return previous.concat({
          date,
          amount,
          balance: newBalance,
        });
      }, [] as AccountBalanceHistoryDto[]);

    return summarizedBalanceChanges;
  }
}