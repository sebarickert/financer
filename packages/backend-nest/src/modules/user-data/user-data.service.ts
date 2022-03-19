import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { TransactionCategoriesService } from 'src/modules/transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from 'src/modules/transaction-category-mappings/transaction-category-mappings.service';
import { TransactionsService } from 'src/modules/transactions/transactions.service';
import { UserDocument } from 'src/modules/users/schemas/user.schema';

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
  ): Promise<{ filename: string; data: any }> {
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
    const data = JSON.stringify({
      user,
      accounts,
      transactions,
      transactionCategories,
      transactionCategoryMappings,
    });

    return { filename, data };
  }

  async overrideUserData(userId: string) {}
}
