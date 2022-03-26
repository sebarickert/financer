import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AccountsService } from '../accounts/accounts.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private accountService: AccountsService,
    private transactionCategoriesService: TransactionCategoriesService,
    private transactionCategoryMappingsService: TransactionCategoryMappingsService,
  ) {}

  async create(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDocument> {
    const { categories: rawCategories, ...transactionData } =
      createTransactionDto;

    await this.verifyTransactionAccountOwnership(
      userId,
      transactionData as any,
    );

    if (transactionData.fromAccount) {
      (transactionData as Transaction).fromAccountBalance =
        await this.parseTransactionAccountBalanceBefore(
          userId,
          transactionData.fromAccount as any,
          transactionData.date,
        );
    }

    if (transactionData.toAccount) {
      (transactionData as Transaction).toAccountBalance =
        await this.parseTransactionAccountBalanceBefore(
          userId,
          transactionData.toAccount as any,
          transactionData.date,
        );
    }

    if (rawCategories) {
      await this.transactionCategoriesService.ensureCategoriesExist(
        rawCategories.map((category) => category.category_id as any),
      );
    }

    const transaction = await this.transactionModel.create(transactionData);

    if (rawCategories) {
      const categories = rawCategories.map((category) => ({
        ...category,
        transaction_id: transaction._id,
        owner: userId,
      }));
      await this.transactionCategoryMappingsService.createMany(categories);
    }

    return transaction;
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

  async findOneNewer(accountId, date) {
    return this.transactionModel.findOne({
      $or: [{ toAccount: accountId }, { fromAccount: accountId }],
      date: { $gt: date },
    });
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
    correctionBalance: { fromAccount?: number; toAccount?: number },
  ): Promise<TransactionDocument> {
    const { categories: rawCategories, ...transactionData } =
      updateTransactionDto;

    await this.findOne(userId, id);
    await this.verifyTransactionAccountOwnership(
      userId,
      transactionData as any,
    );

    if (transactionData.fromAccount) {
      (transactionData as Transaction).fromAccountBalance =
        (await this.parseTransactionAccountBalanceBefore(
          userId,
          transactionData.fromAccount as any,
          transactionData.date,
        )) + (correctionBalance.fromAccount || 0);
    }

    if (transactionData.toAccount) {
      (transactionData as Transaction).toAccountBalance =
        (await this.parseTransactionAccountBalanceBefore(
          userId,
          transactionData.toAccount as any,
          transactionData.date,
        )) - (correctionBalance.toAccount || 0);
    }

    if (rawCategories) {
      await this.transactionCategoriesService.ensureCategoriesExist(
        rawCategories.map((category) => category.category_id as any),
      );
    }

    const transaction = this.transactionModel
      .findByIdAndUpdate(id, transactionData, { new: true })
      .exec();

    await this.transactionCategoryMappingsService.removeAllByUserAndTransaction(
      userId,
      id,
    );
    if (rawCategories) {
      const categories = rawCategories.map((category) => ({
        ...category,
        transaction_id: id,
        owner: userId,
      }));
      await this.transactionCategoryMappingsService.createMany(
        categories as any,
      );
    }

    return transaction;
  }

  async updateTransactionHistoryAndAccount(
    userId,
    accountId,
    date,
    amount,
  ): Promise<void> {
    await Promise.all([
      this.updateAccountBalanceBeforeByAfterDate(accountId, date, amount),
      this.accountService.updateAccountBalance(userId, accountId, amount),
    ]);
  }

  private async updateAccountBalanceBeforeByAfterDate(
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

  private async verifyTransactionAccountOwnership(
    userId: string,
    transaction: Transaction,
  ) {
    if (transaction.toAccount) {
      await this.accountService.findOne(userId, transaction.toAccount as any);
    }
    if (transaction.fromAccount) {
      await this.accountService.findOne(userId, transaction.fromAccount as any);
    }
  }

  private async parseTransactionAccountBalanceBefore(
    userId: string,
    accountId: string,
    date: Date,
  ): Promise<number> {
    const newerTransaction = await this.findOneNewer(accountId, date);

    if (newerTransaction) {
      const isNextTransactionExpense =
        newerTransaction?.fromAccount + '' === accountId;

      return isNextTransactionExpense
        ? newerTransaction.fromAccountBalance
        : newerTransaction.toAccountBalance;
    }

    const account = await this.accountService.findOne(userId, accountId);
    return account.balance;
  }
}
