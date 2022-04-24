import { PaginationDto, TransactionMonthSummaryDto } from '@local/types';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ObjectId } from '../../types/objectId';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { CreateTransactionCategoryMappingDto } from '../transaction-category-mappings/dto/create-transaction-category-mapping.dto';
import { TransactionCategoryMappingDto } from '../transaction-category-mappings/dto/transaction-category-mapping.dto';
import { UpdateTransactionCategoryMappingDto } from '../transaction-category-mappings/dto/update-transaction-category-mapping.dto';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
  ANY = 'any',
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @Inject(forwardRef(() => AccountsService))
    private accountService: AccountsService,
    private transactionCategoriesService: TransactionCategoriesService,
    private transactionCategoryMappingsService: TransactionCategoryMappingsService,
  ) {}

  async create(
    userId: ObjectId,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDocument> {
    const { categories: rawCategories, ...transactionRawData } =
      createTransactionDto;

    await this.verifyTransactionAccountOwnership(userId, transactionRawData);
    await this.verifyCategoriesExists(rawCategories);

    const transactionData = { ...transactionRawData, user: userId };
    const transaction = await this.transactionModel.create(transactionData);

    await this.createCategories(userId, transaction._id, rawCategories);
    await this.updateRelatedAccountBalance(
      userId,
      transaction,
      transaction.amount,
      'add',
    );

    return transaction;
  }

  async createMany(
    createTransactionDto: CreateTransactionDto[],
  ): Promise<TransactionDocument[]> {
    return this.transactionModel.insertMany(createTransactionDto);
  }

  async findOne(userId: ObjectId, id: ObjectId): Promise<TransactionDto> {
    const transaction = await this.transactionModel.findOne({ _id: id });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    } else if (!transaction.user.equals(userId)) {
      throw new UnauthorizedException(
        'Unauthorized to access this transaction.',
      );
    }

    const categories =
      (await this.transactionCategoryMappingsService.findAllByUserAndTransaction(
        userId,
        transaction._id,
      )) as TransactionCategoryMappingDto[];

    return {
      ...transaction.toObject(),
      categories,
    };
  }

  async findAllByUser(
    userId: ObjectId,
    transactionType: TransactionType,
    page?: number,
    limit = 10,
    year?: number,
    month?: number,
    linkedAccount?: ObjectId,
  ): Promise<PaginationDto<TransactionDto[]>> {
    if (!year && month) {
      throw new BadRequestException('Year is required when month is provided');
    }

    const query = {
      user: userId,
      ...this.getTransactionTypeFilter(transactionType),
      ...this.getYearAndMonthFilter(year, month),
      ...this.getLinkedAccountFilter(linkedAccount),
    };
    const totalCount = await this.transactionModel
      .find(query)
      .countDocuments()
      .exec();
    const lastPage = page ? Math.ceil(totalCount / limit) : 1;

    if (page && (page < 1 || page > lastPage)) {
      throw new NotFoundException(
        `Page "${page}" not found. First page is "1" and last page is "${lastPage}"`,
      );
    }

    const transactions = await this.transactionModel
      .find(query)
      .sort({ date: 'desc' })
      .skip(page ? (page - 1) * limit : 0)
      .limit(page ? limit : 0)
      .exec();

    const data = await Promise.all(
      transactions.map(async (transaction) => {
        const categories =
          (await this.transactionCategoryMappingsService.findAllByUserAndTransaction(
            userId,
            transaction._id,
          )) as TransactionCategoryMappingDto[];
        return { ...transaction.toObject(), categories };
      }),
    );

    return {
      data,
      currentPage: page ?? 1,
      limit: page ? limit : totalCount,
      totalPageCount: lastPage,
      hasNextPage: (page ?? 1) < lastPage,
      hasPreviousPage: (page ?? 1) > 1,
      totalRowCount: totalCount,
    };
  }

  async findAllByUserForExport(
    userId: ObjectId,
  ): Promise<TransactionDocument[]> {
    return this.transactionModel.find({ user: userId });
  }

  async findMonthlySummariesByUser(
    userId: ObjectId,
    getTransactionType: TransactionType,
  ): Promise<TransactionMonthSummaryDto[]> {
    return this.transactionModel
      .aggregate([
        {
          $match: {
            user: userId,
            ...this.getTransactionTypeFilter(getTransactionType),
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
      .exec();
  }

  async update(
    userId: ObjectId,
    id: ObjectId,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDocument> {
    const { categories: rawCategories, ...transactionData } =
      updateTransactionDto;

    const transactionBefore = await this.findOne(userId, id);
    await this.verifyTransactionAccountOwnership(userId, transactionData);
    await this.verifyCategoriesExists(rawCategories);
    await this.updateRelatedAccountBalance(
      userId,
      transactionBefore,
      transactionBefore.amount,
      'remove',
    );

    const transaction = await this.transactionModel
      .findByIdAndUpdate(id, transactionData, { new: true })
      .exec();

    await this.transactionCategoryMappingsService.removeAllByUserAndTransaction(
      userId,
      id,
    );
    await this.createCategories(userId, id, rawCategories);
    await this.updateRelatedAccountBalance(
      userId,
      transaction,
      transaction.amount,
      'add',
    );

    return transaction;
  }

  async remove(
    transaction: Partial<TransactionDto>,
    userId: ObjectId,
  ): Promise<void> {
    await this.updateRelatedAccountBalance(
      userId,
      transaction,
      transaction.amount,
      'remove',
    );
    await this.transactionModel.findByIdAndDelete(transaction._id).exec();
  }

  async removeAllByUser(userId: ObjectId): Promise<void> {
    await this.transactionModel.deleteMany({ user: userId }).exec();
  }

  private async updateRelatedAccountBalance(
    userId: ObjectId,
    transaction: Partial<Transaction>,
    amount: number,
    type: 'add' | 'remove',
  ): Promise<void> {
    const amountToApply = type === 'add' ? amount : -amount;

    if (transaction.toAccount) {
      await this.accountService.updateBalance(
        userId,
        transaction.toAccount,
        amountToApply,
      );
    }
    if (transaction.fromAccount) {
      await this.accountService.updateBalance(
        userId,
        transaction.fromAccount,
        -amountToApply,
      );
    }
  }

  private async verifyTransactionAccountOwnership(
    userId: ObjectId,
    transaction: Partial<Transaction>,
  ) {
    if (transaction.toAccount) {
      await this.accountService.findOne(userId, transaction.toAccount);
    }
    if (transaction.fromAccount) {
      await this.accountService.findOne(userId, transaction.fromAccount);
    }
  }

  private async verifyCategoriesExists(
    categories?:
      | CreateTransactionCategoryMappingDto[]
      | UpdateTransactionCategoryMappingDto[],
  ) {
    if (!categories) {
      return;
    }

    await this.transactionCategoriesService.ensureCategoriesExist(
      categories.map((category) => category.category_id),
    );
  }

  private async createCategories(
    userId: ObjectId,
    transactionId: ObjectId,
    categories?:
      | CreateTransactionCategoryMappingDto[]
      | UpdateTransactionCategoryMappingDto[],
  ) {
    if (!categories) {
      return;
    }

    const categoriesWithAllFields = categories.map((category) => ({
      ...category,
      transaction_id: transactionId,
      owner: userId,
    }));

    await this.transactionCategoryMappingsService.createMany(
      categoriesWithAllFields,
    );
  }

  private getTransactionTypeFilter(transactionType: TransactionType): {
    [key: string]: unknown;
  } {
    switch (transactionType) {
      case TransactionType.INCOME:
        return {
          toAccount: { $ne: undefined },
          fromAccount: { $eq: undefined },
        };
      case TransactionType.EXPENSE:
        return {
          fromAccount: { $ne: undefined },
          toAccount: { $eq: undefined },
        };
      case TransactionType.TRANSFER:
        return {
          fromAccount: { $ne: undefined },
          toAccount: { $ne: undefined },
        };
      case TransactionType.ANY:
        return {};
      default:
        throw new Error(`Invalid transaction type: ${transactionType}`);
    }
  }

  private getYearAndMonthFilter(year?: number, month?: number) {
    if (!year && !month) {
      return {};
    }

    return {
      date: {
        $gte: new Date(year, month - 1 || 0, 1),
        $lt: new Date(year, month || 12, 1),
      },
    };
  }

  private getLinkedAccountFilter(accountId?: ObjectId) {
    if (!accountId) {
      return {};
    }

    return {
      $or: [
        {
          toAccount: accountId,
        },
        {
          fromAccount: accountId,
        },
      ],
    };
  }
}
