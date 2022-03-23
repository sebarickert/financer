import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AccountsService } from '../accounts/accounts.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private accountService: AccountsService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDocument> {
    return this.transactionModel.create(createTransactionDto);
  }

  async createMany(
    createTransactionDto: CreateTransactionDto[],
  ): Promise<TransactionDocument[]> {
    return this.transactionModel.insertMany(createTransactionDto);
  }

  async findOne(userId: string, id: string): Promise<TransactionDocument> {
    const transaction = await this.transactionModel.findOne({ _id: id });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    } else if (transaction.user + '' !== (userId as any)) {
      throw new UnauthorizedException(
        'Unauthorized to access this transaction.',
      );
    }

    return transaction;
  }

  async findAllByUser(userId: string): Promise<TransactionDocument[]> {
    return this.transactionModel.find({ owner: userId }).exec();
  }

  async findAllByAccount(
    userId: string,
    accountId: string,
  ): Promise<TransactionDocument[]> {
    await this.accountService.findOne(userId, accountId);
    return this.transactionModel
      .find({
        $or: [
          {
            toAccount: accountId,
          },
          {
            fromAccount: accountId,
          },
        ],
      })
      .exec();
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDocument> {
    if (updateTransactionDto.toAccount) {
      await this.accountService.findOne(
        userId,
        updateTransactionDto.toAccount as any,
      );
    }
    if (updateTransactionDto.fromAccount) {
      await this.accountService.findOne(
        userId,
        updateTransactionDto.fromAccount as any,
      );
    }

    await this.findOne(userId, id);
    return this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec();
  }

  async updateAccountBalanceBeforeByAfterDate(
    accountId: string,
    date: Date,
    balanceChange: number,
  ): Promise<void> {
    await Promise.all([
      this.updateToAccountBalanceBeforeByAfterDate(
        accountId,
        date,
        balanceChange,
      ),
      this.updateFromAccountBalanceBeforeByAfterDate(
        accountId,
        date,
        balanceChange,
      ),
    ]);
  }

  private async updateToAccountBalanceBeforeByAfterDate(
    accountId: string,
    date: Date,
    balanceChange: number,
  ): Promise<any> {
    return this.transactionModel.updateMany(
      {
        toAccount: accountId,
        date: { $gt: date },
      },
      { $inc: { toAccountBalance: balanceChange } },
    );
  }

  private async updateFromAccountBalanceBeforeByAfterDate(
    accountId: string,
    date: Date,
    balanceChange: number,
  ): Promise<any> {
    return this.transactionModel
      .updateMany(
        {
          fromAccount: accountId,
          date: { $gt: date },
        },
        { $inc: { fromAccountBalance: balanceChange } },
      )
      .exec();
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async removeAllByUser(userId: string): Promise<any> {
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
