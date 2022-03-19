import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { TransactionCategoriesService } from 'src/modules/transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from 'src/modules/transaction-category-mappings/transaction-category-mappings.service';
import { TransactionsService } from 'src/modules/transactions/transactions.service';
import { UserDocument } from 'src/modules/users/schemas/user.schema';

import { AccountDocument } from '../accounts/schemas/account.schema';
import { TransactionCategoryDocument } from '../transaction-categories/schemas/transaction-category.schema';
import { TransactionCategoryMappingDocument } from '../transaction-category-mappings/schemas/transaction-category-mapping.schema';
import { TransactionDocument } from '../transactions/schemas/transaction.schema';

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
    userId: string,
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

    const accountsWithCurrentUserId = accounts.map((account) => ({
      ...account,
      owner: userId,
    }));

    const transactionsWithCurrentUserId = transactions.map((transaction) => ({
      ...transaction,
      user: userId,
    }));

    const transactionCategoriesWithCurrentUserId = transactionCategories.map(
      (transactionCategory) => ({
        ...transactionCategory,
        owner: userId,
      }),
    );

    const transactionCategoryMappingsWithCurrentUserId =
      transactionCategoryMappings.map((transactionCategoryMapping) => ({
        ...transactionCategoryMapping,
        owner: userId,
      }));

    await Promise.all([
      this.accountService.createMany(accountsWithCurrentUserId),
      this.transactionService.createMany(transactionsWithCurrentUserId),
      this.transactionCategoriesService.createMany(
        transactionCategoriesWithCurrentUserId,
      ),
      this.transactionCategoryMappingService.createMany(
        transactionCategoryMappingsWithCurrentUserId,
      ),
    ]);

    return { payload: 'Successfully overrided data.' };
  }
}
