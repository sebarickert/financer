import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountType,
  Prisma,
  Transaction,
  TransactionType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { TransactionRepo } from '../../database/repos/transaction.repo';
import { ForceMutable } from '../../types/force-mutable';
import { UserId } from '../../types/user-id';
import { DateService } from '../../utils/date.service';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { CreateTransactionCategoryMappingDto } from '../transaction-category-mappings/dto/create-transaction-category-mapping.dto';
import { UpdateTransactionCategoryMappingDto } from '../transaction-category-mappings/dto/update-transaction-category-mapping.dto';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDetailsDto } from './dto/transaction-details.dto';
import {
  TransactionListItem,
  TransactionListItemDto,
} from './dto/transaction-list-item.dto';
import { TransactionMonthSummaryDto } from './dto/transaction-month-summary.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly transactionRepo: TransactionRepo,
    @Inject(forwardRef(() => AccountsService))
    private readonly accountService: AccountsService,
    private readonly transactionCategoriesService: TransactionCategoriesService,
    private readonly transactionCategoryMappingsService: TransactionCategoryMappingsService,
  ) {}

  async create(
    userId: UserId,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    const { categories: rawCategories, ...transactionRawData } =
      createTransactionDto;

    await this.verifyTransactionAccountOwnership(userId, transactionRawData);
    await this.verifyCategoriesExists(rawCategories);

    const transactionData = { ...transactionRawData, userId };
    const transaction = await this.transactionRepo.create(transactionData);

    await this.createCategories(userId, transaction.id, rawCategories);
    await this.updateRelatedAccountBalance(
      userId,
      transaction,
      transaction.amount,
      'add',
    );

    return TransactionDto.createFromPlain(transaction);
  }

  createMany(userId: UserId, createTransactionDto: CreateTransactionDto[]) {
    return this.transactionRepo.createMany(
      // @ts-expect-error - remove legacy `v` from import data
      createTransactionDto.map(({ v, ...transaction }) => ({
        ...transaction,
        userId,
        categories: undefined,
      })),
    );
  }

  async findOne(userId: UserId, id: string): Promise<TransactionDetailsDto> {
    const transaction = await this.transactionRepo.findOne({
      where: { id, userId },
      include: {
        transactionTemplateLog: {
          select: {
            id: true,
          },
        },
        categories: {
          select: {
            categoryId: true,
            description: true,
            amount: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        from: {
          select: {
            name: true,
          },
        },
        to: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }

    const allCategories =
      await this.transactionCategoriesService.findAllByUser(userId);

    const { from, to, categories, transactionTemplateLog, ...transactionData } =
      transaction;

    return TransactionDetailsDto.createFromPlain({
      ...transactionData,
      fromAccountName: from?.name ?? null,
      toAccountName: to?.name ?? null,
      isRecurring: transactionTemplateLog.length > 0,
      categories: categories.map((category) => ({
        id: category.categoryId,
        description: category.description,
        amount: category.amount,
        name: category.category.name,
        path: TransactionCategoriesService.buildParentCategoryPath(
          allCategories,
          category.categoryId,
        ),
      })),
    });
  }

  async findAllByUser(
    userId: UserId,
    transactionType: TransactionType | null,
    limit?: number,
    year?: number,
    month?: number,
    linkedAccount?: string,
    accountTypes?: AccountType[],
    sortOrder: Prisma.SortOrder = Prisma.SortOrder.desc,
    transactionCategories?: string[],
    parentTransactionCategory?: string,
  ): Promise<TransactionListItemDto[]> {
    const targetCategoryIds =
      transactionCategories ||
      (await this.findChildrenCategoryIds(parentTransactionCategory));

    const transactionWhere: Prisma.TransactionWhereInput = {
      userId,
      ...TransactionRepo.filterByType(transactionType),
      ...TransactionRepo.filterByYearAndMonth(year, month),
      ...TransactionRepo.filterByAccount(linkedAccount),
      ...(await this.filterTransactionsByCategory(userId, targetCategoryIds)),
      ...(await this.filterTransactionsByAccountType(userId, accountTypes)),
    };

    const totalCount = await this.transactionRepo.getCount({
      where: transactionWhere,
    });

    const fetchedTransactions = await this.transactionRepo.findMany({
      where: transactionWhere,
      orderBy: { date: sortOrder },
      take: limit || totalCount,
      include: {
        categories: {
          select: {
            categoryId: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        transactionTemplateLog: {
          select: {
            id: true,
          },
        },
      },
    });

    return TransactionListItemDto.createFromPlain(
      fetchedTransactions.map<TransactionListItem>(
        ({ categories, transactionTemplateLog, ...transaction }) => ({
          ...transaction,
          isRecurring: transactionTemplateLog.length > 0,
          categories: categories.map(({ categoryId, category }) => ({
            name: category.name,
            id: categoryId,
          })),
        }),
      ),
    );
  }

  async findAllByUserForExport(userId: UserId): Promise<TransactionDto[]> {
    const transactions = await this.transactionRepo.findMany({
      where: {
        userId,
      },
    });
    return TransactionDto.createFromPlain(transactions);
  }

  findMonthlySummariesByUser = async (
    userId: UserId,
    year?: number,
    month?: number,
    accountTypes?: AccountType[],
    transactionCategories?: string[],
    parentTransactionCategory?: string,
  ): Promise<TransactionMonthSummaryDto[]> => {
    const targetCategoryIds =
      transactionCategories ||
      (await this.findChildrenCategoryIds(parentTransactionCategory));

    const accountIds = new Set(
      await this.getAccountIdsByType(userId, accountTypes),
    );

    const transactions = await this.transactionRepo.findMany({
      where: {
        userId,
        ...TransactionRepo.filterByYearAndMonth(year, month, 'laterThan'),
        ...TransactionRepo.filterByAccount(Array.from(accountIds)),
        ...(await this.filterTransactionsByCategory(userId, targetCategoryIds)),
      },
    });

    const summaries = new Map<
      string,
      ForceMutable<TransactionMonthSummaryDto>
    >();

    Array.from(
      Map.groupBy(transactions, (transaction) => {
        const zonedDate = DateService.toZonedTime(transaction.date);

        const transactionMonth = zonedDate.getMonth() + 1;
        const transactionYear = zonedDate.getFullYear();

        let type: TransactionType;

        const hasFromAccountWithWithinFilter =
          transaction.fromAccount &&
          (accountIds.size === 0 || accountIds.has(transaction.fromAccount));

        const hasToAccountWithWithinFilter =
          transaction.toAccount &&
          (accountIds.size === 0 || accountIds.has(transaction.toAccount));

        if (hasFromAccountWithWithinFilter && hasToAccountWithWithinFilter) {
          type = TransactionType.TRANSFER;
        } else if (hasFromAccountWithWithinFilter) {
          type = TransactionType.EXPENSE;
        } else {
          type = TransactionType.INCOME;
        }

        return {
          type,
          month: transactionMonth,
          year: transactionYear,
        };
      }).entries(),
    ).forEach(([key, value]) => {
      const { type, month: transactionMonth, year: transactionYear } = key;

      const count = value.length;
      const amount = value.reduce(
        (acc, transaction) => acc.add(transaction.amount),
        new Decimal(0),
      );

      const summary = summaries.get(
        `${transactionYear}-${transactionMonth}`,
      ) || {
        id: { month: transactionMonth, year: transactionYear },
        totalCount: 0,
        incomesCount: 0,
        expensesCount: 0,
        transfersCount: 0,
        totalAmount: new Decimal(0),
        incomeAmount: new Decimal(0),
        expenseAmount: new Decimal(0),
        transferAmount: new Decimal(0),
      };

      summary.totalCount += count;

      if (type === TransactionType.TRANSFER) {
        summary.transfersCount += count;
        summary.transferAmount = summary.transferAmount.add(amount);
      } else if (type === TransactionType.EXPENSE) {
        summary.expensesCount += count;
        summary.expenseAmount = summary.expenseAmount.add(amount);

        summary.totalAmount = summary.totalAmount.minus(amount);
      } else {
        summary.incomesCount += count;
        summary.incomeAmount = summary.incomeAmount.add(amount);

        summary.totalAmount = summary.totalAmount.add(amount);
      }

      summaries.set(`${transactionYear}-${transactionMonth}`, summary);
    });

    const data = Array.from(summaries.values())
      .sort((a, b) => {
        // Compare years first
        if (a.id.year > b.id.year) return -1;
        if (a.id.year < b.id.year) return 1;

        // If years are equal, compare months
        if (a.id.month > b.id.month) return -1;
        if (a.id.month < b.id.month) return 1;

        // If both year and month are equal, consider them equal in terms of sorting
        return 0;
      })
      .map((summary) => ({
        ...summary,
        totalAmount: summary.totalAmount,
        incomeAmount: summary.incomeAmount,
        expenseAmount: summary.expenseAmount,
        transferAmount: summary.transferAmount,
      }));

    return TransactionMonthSummaryDto.createFromPlain(data);
  };

  async update(
    userId: UserId,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
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

    const transaction = await this.transactionRepo.update({
      where: { id, userId },
      data: transactionData,
    });

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

    return TransactionDto.createFromPlain(transaction);
  }

  async remove(
    transaction: Partial<TransactionDto>,
    userId: UserId,
  ): Promise<void> {
    await this.updateRelatedAccountBalance(
      userId,
      transaction,
      transaction.amount,
      'remove',
    );

    await this.transactionRepo.delete({ id: transaction.id });
  }

  removeAllByUser(userId: UserId) {
    return this.transactionRepo.deleteMany({ userId });
  }

  private async updateRelatedAccountBalance(
    userId: UserId,
    transaction: Partial<Transaction>,
    amount: Decimal,
    type: 'add' | 'remove',
  ): Promise<void> {
    const amountToApply = type === 'add' ? amount : amount.negated();

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
        amountToApply.negated(),
      );
    }
  }

  private async verifyTransactionAccountOwnership(
    userId: UserId,
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
      categories.map((category) => category.categoryId),
    );
  }

  private async createCategories(
    userId: UserId,
    transactionId: string,
    categories?: Omit<CreateTransactionCategoryMappingDto, 'transactionId'>[],
  ) {
    if (!categories) {
      return;
    }

    const categoriesWithAllFields =
      categories.map<CreateTransactionCategoryMappingDto>((category) => ({
        ...category,
        transactionId,
        userId,
      }));

    await this.transactionCategoryMappingsService.createMany(
      userId,
      categoriesWithAllFields,
    );
  }

  private async filterTransactionsByCategory(
    userId: UserId,
    categoryIds?: string[],
  ) {
    if (!categoryIds) {
      return {};
    }

    const transactionIds = (
      await this.transactionCategoryMappingsService.findAllByUserAndCategoryIds(
        userId,
        categoryIds.map((id) => id.toString()),
      )
    ).map(({ transactionId }) => transactionId);

    return TransactionRepo.filterById(transactionIds);
  }

  private async getAccountIdsByType(
    userId: UserId,
    accountTypes?: AccountType[],
  ) {
    if (!accountTypes?.length) return [];

    const accounts = await this.accountService.findAllByUser(
      userId,
      accountTypes,
    );

    return accounts.map(({ id }) => id);
  }

  private async filterTransactionsByAccountType(
    userId: UserId,
    accountTypes?: AccountType[],
  ) {
    if (!accountTypes?.length) return {};

    const accountIds = await this.getAccountIdsByType(userId, accountTypes);

    return TransactionRepo.filterByAccount(accountIds);
  }

  private async findChildrenCategoryIds(parentId: string) {
    if (!parentId) {
      return null;
    }

    const childCategoryIds = (
      await this.transactionCategoriesService.findAllChildrenById([
        parentId.toString(),
      ])
    ).map(({ id }) => id);

    return [parentId, ...childCategoryIds];
  }
}
