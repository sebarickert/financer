import crypto from 'crypto';

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserPreferenceProperty } from '@prisma/client';

import { PrismaTransactionService } from '../../database/prisma-transaction.service';
import { UserId } from '../../types/user-id';
import { AccountBalanceChangesService } from '../account-balance-changes/account-balance-changes.service';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';
import { TransactionTemplatesService } from '../transaction-templates/transaction-templates.service';
import { TransactionsService } from '../transactions/transactions.service';
import { UserPreferencesService } from '../user-preferences/user-preferences.service';
import { UsersService } from '../users/users.service';

import { UserDataExportDto } from './dto/user-data-export.dto';
import { UserDataImportDto } from './dto/user-data-import.dto';

const getMyDataFilename = (): string => {
  const addLeadingZero = (number: number): string => `0${number}`.substr(-2);

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `my-financer-data-${year}${addLeadingZero(month)}${addLeadingZero(
    day,
  )}.json`;
};

@Injectable()
export class UserDataService {
  private static readonly ACCOUNT_USER_PROPERTIES: UserPreferenceProperty[] = [
    UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
    UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT,
    UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
    UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT,
  ];

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly accountBalanceChangesService: AccountBalanceChangesService,
    private readonly transactionService: TransactionsService,
    private readonly transactionCategoriesService: TransactionCategoriesService,
    private readonly transactionCategoryMappingService: TransactionCategoryMappingsService,
    private readonly userPreferencesService: UserPreferencesService,
    private readonly transactionTemplateService: TransactionTemplatesService,
    private readonly prismaTransactionService: PrismaTransactionService,
  ) {}

  async findAllOneUserData(
    userId: UserId,
  ): Promise<{ filename: string; data: UserDataExportDto }> {
    const user = await this.usersService.findOne(userId);
    const accounts = await this.accountsService.findAllByUserForExport(userId);
    const accountBalanceChanges =
      await this.accountBalanceChangesService.findAllByUserForExport(userId);
    const transactions =
      await this.transactionService.findAllByUserForExport(userId);
    const transactionCategories =
      await this.transactionCategoriesService.findAllByUserForExport(userId);
    const transactionCategoryMappings =
      await this.transactionCategoryMappingService.findAllByUserForExport(
        userId,
      );
    const userPreferences =
      await this.userPreferencesService.findAllByUserForExport(userId);
    const transactionTemplates =
      await this.transactionTemplateService.findAllByUserForExport(userId);
    const transactionTemplateLogs =
      await this.transactionTemplateService.findAllLogsByUserForExport(userId);

    const filename = getMyDataFilename();
    const data = {
      user,
      accounts,
      accountBalanceChanges,
      transactions,
      transactionCategories,
      transactionCategoryMappings,
      userPreferences,
      transactionTemplates,
      transactionTemplateLogs,
    };

    return { filename, data };
  }

  async overrideUserData(
    userId: UserId,
    {
      accounts: originalAccounts = [],
      accountBalanceChanges: originalAccountBalanceChanges = [],
      transactions: originalTransactions = [],
      transactionCategories: originalTransactionCategories = [],
      transactionCategoryMappings: originalTransactionCategoryMappings = [],
      userPreferences: originalUserPreferences = [],
      transactionTemplates: originalTransactionTemplates = [],
      transactionTemplateLogs: originalTransactionTemplateLogs = [],
    }: UserDataImportDto,
  ) {
    const accountIdMapping = new Map<string, string>();
    const transactionIdMapping = new Map<string, string>();
    const transactionCategoryIdMapping = new Map<string, string>();
    const transactionTemplateIdMapping = new Map<string, string>();

    const accounts = originalAccounts.map((account) => {
      const newId = crypto.randomUUID();
      accountIdMapping.set(account.id, newId);
      return { ...account, id: newId };
    });
    const accountBalanceChanges = originalAccountBalanceChanges.map(
      (accountBalanceChange) => {
        const newId = crypto.randomUUID();

        const newAccountId = accountIdMapping.get(
          accountBalanceChange.accountId,
        );

        return { ...accountBalanceChange, id: newId, accountId: newAccountId };
      },
    );

    const transactions = originalTransactions.map((transaction) => {
      const newId = crypto.randomUUID();
      transactionIdMapping.set(transaction.id, newId);

      const newToAccount = transaction.toAccount
        ? accountIdMapping.get(transaction.toAccount)
        : null;
      const newFromAccount = transaction.fromAccount
        ? accountIdMapping.get(transaction.fromAccount)
        : null;

      return {
        ...transaction,
        id: newId,
        toAccount: newToAccount,
        fromAccount: newFromAccount,
      };
    });

    const transactionCategories = originalTransactionCategories
      .map((transactionCategory) => {
        const newId = crypto.randomUUID();
        transactionCategoryIdMapping.set(transactionCategory.id, newId);
        return { ...transactionCategory, id: newId };
      })
      .map((transactionCategory) => {
        if (transactionCategory.parentCategoryId) {
          transactionCategory.parentCategoryId =
            transactionCategoryIdMapping.get(
              transactionCategory.parentCategoryId,
            );
        }
        return transactionCategory;
      });

    const transactionCategoryMappings = originalTransactionCategoryMappings.map(
      (transactionCategoryMapping) => {
        const newId = crypto.randomUUID();

        const newCategoryId = transactionCategoryIdMapping.get(
          transactionCategoryMapping.categoryId,
        );
        const newTransactionId = transactionIdMapping.get(
          transactionCategoryMapping.transactionId,
        );

        return {
          ...transactionCategoryMapping,
          id: newId,
          categoryId: newCategoryId,
          transactionId: newTransactionId,
        };
      },
    );

    const transactionTemplates = originalTransactionTemplates.map(
      (transactionTemplate) => {
        const newId = crypto.randomUUID();

        transactionTemplateIdMapping.set(transactionTemplate.id, newId);

        const newToAccount = transactionTemplate.toAccount
          ? accountIdMapping.get(transactionTemplate.toAccount)
          : null;
        const newFromAccount = transactionTemplate.fromAccount
          ? accountIdMapping.get(transactionTemplate.fromAccount)
          : null;

        const newCategories = transactionTemplate.categories.map((category) =>
          transactionCategoryIdMapping.get(category),
        );

        return {
          ...transactionTemplate,
          id: newId,
          categories: newCategories,
          toAccount: newToAccount,
          fromAccount: newFromAccount,
        };
      },
    );

    const transactionTemplateLogs = originalTransactionTemplateLogs.map(
      (transactionTemplateLog) => {
        const newId = crypto.randomUUID();

        const newTemplateId = transactionTemplateIdMapping.get(
          transactionTemplateLog.templateId,
        );

        const newTransactionId = transactionIdMapping.get(
          transactionTemplateLog.transactionId,
        );

        return {
          ...transactionTemplateLog,
          id: newId,
          templateId: newTemplateId,
          transactionId: newTransactionId,
        };
      },
    );

    const userPreferences = originalUserPreferences.map((userPreference) => {
      const newId = crypto.randomUUID();

      if (
        UserDataService.ACCOUNT_USER_PROPERTIES.includes(userPreference.key)
      ) {
        // @ts-expect-error - We know that the key is in the array
        userPreference.value = accountIdMapping.get(userPreference.value);
      } else if (
        userPreference.key ===
        UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE
      ) {
        transactionCategoryIdMapping.forEach((newCategoryId, oldCategoryId) => {
          // @ts-expect-error - We know that the key is in the array
          userPreference.value = userPreference.value.replace(
            oldCategoryId,
            newCategoryId,
          );
        });
      }

      return { ...userPreference, id: newId };
    });

    await this.prismaTransactionService.transaction([
      this.accountBalanceChangesService.removeAllByUser(userId),
      this.transactionCategoryMappingService.removeAllByUser(userId),
      this.transactionTemplateService.removeAllByUser(userId),
      this.transactionTemplateService.removeAllLogsByUser(userId),
      this.accountsService.removeAllByUser(userId),
      this.transactionService.removeAllByUser(userId),
      this.transactionCategoriesService.removeAllByUser(userId),
      this.userPreferencesService.removeAllByUser(userId),
    ]);

    await this.prismaTransactionService.transaction([
      this.accountsService.createMany(userId, accounts),
      this.transactionService.createMany(userId, transactions),
      this.transactionCategoriesService.createMany(
        userId,
        transactionCategories,
      ),
      this.userPreferencesService.createMany(userId, userPreferences),
      this.transactionTemplateService.createMany(userId, transactionTemplates),
      this.transactionTemplateService.createManyLogs(
        userId,
        transactionTemplateLogs,
      ),
      this.accountBalanceChangesService.createMany(
        userId,
        accountBalanceChanges,
      ),
      this.transactionCategoryMappingService.createMany(
        userId,
        transactionCategoryMappings,
      ),
    ]);

    return { payload: 'Successfully overrided data.' };
  }
}
