import { Injectable } from '@nestjs/common';

import { ObjectId, parseObjectId } from '../../types/objectId';
import { AccountsService } from '../accounts/accounts.service';
import { AccountDocument } from '../accounts/schemas/account.schema';
import { TransactionCategoryDocument } from '../transaction-categories/schemas/transaction-category.schema';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingDocument } from '../transaction-category-mappings/schemas/transaction-category-mapping.schema';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';
import { TransactionDocument } from '../transactions/schemas/transaction.schema';
import { TransactionsService } from '../transactions/transactions.service';
import { UserDocument } from '../users/schemas/user.schema';

export type ImportUserDataDto = {
  transactions: TransactionDocument[];
  accounts: AccountDocument[];
  transactionCategories: TransactionCategoryDocument[];
  transactionCategoryMappings: TransactionCategoryMappingDocument[];
};

export type ExportUserDataDto = ImportUserDataDto & {
  user: UserDocument;
};

@Injectable()
export class UserDataService {
  constructor(
    private accountService: AccountsService,
    private transactionService: TransactionsService,
    private transactionCategoriesService: TransactionCategoriesService,
    private transactionCategoryMappingService: TransactionCategoryMappingsService,
  ) {}

  async findAllOneUserData(
    user: UserDocument,
  ): Promise<{ filename: string; data: ExportUserDataDto }> {
    const getMyDataFilename = (): string => {
      const addLeadingZero = (number: number): string =>
        `0${number}`.substr(-2);

      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `my-financer-data-${year}${addLeadingZero(month)}${addLeadingZero(
        day,
      )}.json`;
    };
    const userId = user._id;
    const accounts = await this.accountService.findAllByUser(userId);
    const transactions = await this.transactionService.findAllByUser(userId);
    const transactionCategories =
      await this.transactionCategoriesService.findAllByUser(userId);
    const transactionCategoryMappings =
      await this.transactionCategoryMappingService.findAllByUser(userId);

    const filename = getMyDataFilename();
    const data = {
      user,
      accounts,
      transactions,
      transactionCategories,
      transactionCategoryMappings,
    };

    return { filename, data };
  }

  async overrideUserData(
    userId: ObjectId,
    {
      accounts,
      transactions,
      transactionCategories,
      transactionCategoryMappings,
    }: ImportUserDataDto,
  ) {
    await Promise.all([
      this.accountService.removeAllByUser(userId),
      this.transactionService.removeAllByUser(userId),
      this.transactionCategoriesService.removeAllByUser(userId),
      this.transactionCategoryMappingService.removeAllByUser(userId),
    ]);

    const parsedAccounts = accounts.map((account) => ({
      ...account,
      owner: userId,
    }));

    const parsedTransactions = transactions.map(
      ({ toAccount, fromAccount, ...transaction }) => ({
        ...transaction,
        toAccount: parseObjectId(toAccount),
        fromAccount: parseObjectId(fromAccount),
        user: userId,
      }),
    );

    const parsedTransactionCategories = transactionCategories.map(
      ({ parent_category_id, ...transactionCategory }) => ({
        ...transactionCategory,
        parent_category_id: parseObjectId(parent_category_id),
        owner: userId,
      }),
    );

    const parsedTransactionCategoryMappings = transactionCategoryMappings.map(
      ({ category_id, transaction_id, ...transactionCategoryMapping }) => ({
        ...transactionCategoryMapping,
        category_id: parseObjectId(category_id),
        transaction_id: parseObjectId(transaction_id),
        owner: userId,
      }),
    );

    await Promise.all([
      this.accountService.createMany(parsedAccounts),
      this.transactionService.createMany(parsedTransactions),
      this.transactionCategoriesService.createMany(parsedTransactionCategories),
      this.transactionCategoryMappingService.createMany(
        parsedTransactionCategoryMappings,
      ),
    ]);

    return { payload: 'Successfully overrided data.' };
  }
}
