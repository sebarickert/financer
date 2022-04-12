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
import { AccountsService } from '../accounts/accounts.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { CreateTransactionCategoryMappingDto } from '../transaction-category-mappings/dto/create-transaction-category-mapping.dto';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

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

  async findOne(userId: ObjectId, id: ObjectId): Promise<TransactionDocument> {
    const transaction = await this.transactionModel.findOne({ _id: id });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    } else if (!transaction.user.equals(userId)) {
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

  async findAllByUser(userId: ObjectId): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({ user: userId })
      .sort({ date: 'desc' })
      .exec();
  }

  async findAllByAccount(
    userId: ObjectId,
    accountId: ObjectId,
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
      .sort({ date: 'desc' })
      .exec();
  }

  async findAllIncomesByUser(userId: ObjectId): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({
        user: userId,
        toAccount: { $ne: undefined },
        fromAccount: { $eq: undefined },
      })
      .sort({ date: 'desc' })
      .exec();
  }

  async findAllExpensesByUser(
    userId: ObjectId,
  ): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({
        user: userId,
        fromAccount: { $ne: undefined },
        toAccount: { $eq: undefined },
      })
      .sort({ date: 'asc' })
      .exec();
  }

  async findAllTransfersByUser(
    userId: ObjectId,
  ): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({
        user: userId,
        fromAccount: { $ne: undefined },
        toAccount: { $ne: undefined },
      })
      .sort({ date: 'desc' })
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
    transaction: TransactionDocument,
    userId: ObjectId,
  ): Promise<void> {
    await this.updateRelatedAccountBalance(
      userId,
      transaction,
      transaction.amount,
      'remove',
    );
    await transaction.delete();
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
    categories?: CreateTransactionCategoryMappingDto[],
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
    categories?: CreateTransactionCategoryMappingDto[],
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
}
