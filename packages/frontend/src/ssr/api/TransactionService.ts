import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';
import { ExpenseService } from './ExpenseService';
import { IncomeService } from './IncomeService';
import { TransferService } from './TransferService';

import {
  ExpenseListItemDto,
  IncomeListItemDto,
  TransactionDetailsDto,
  TransactionListItemDto,
  TransactionMonthSummaryDto,
  TransactionType,
  TransactionsFindAllByUserApiArg,
  TransactionsFindMonthlySummariesByUserApiArg,
  TransferListItemDto,
} from '$api/generated/financerApi';

export type TransactionListOptions = Omit<
  TransactionsFindAllByUserApiArg,
  'sortOrder'
> & {
  sortOrder?: 'asc' | 'desc';
};

export type FirstTransactionByTypeOptions = Omit<
  TransactionListOptions,
  'limit' | 'sortOrder'
>;

export class TransactionService extends BaseApi {
  public static async revalidateCache(id?: string): Promise<void> {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.TRANSACTION, id));
      return;
    }

    revalidateTag(this.API_TAG.TRANSACTION);
  }

  public static async getMonthlySummary(
    params: TransactionsFindMonthlySummariesByUserApiArg,
  ): Promise<TransactionMonthSummaryDto[]> {
    const { data, error } = await this.client.GET(
      '/api/transactions/monthly-summaries',
      {
        params: {
          query: params,
        },
        next: {
          tags: [
            this.API_TAG.TRANSACTION,
            this.API_TAG.EXPENSE,
            this.API_TAG.INCOME,
            this.API_TAG.TRANSFER,
          ],
        },
      },
    );

    if (error) {
      throw new Error('Failed to fetch monthly summaries', error);
    }

    return data;
  }

  public static async getFirstByType(
    type?: TransactionType.Expense,
    options?: FirstTransactionByTypeOptions,
  ): Promise<ExpenseListItemDto>;
  public static async getFirstByType(
    type?: TransactionType.Income,
    options?: FirstTransactionByTypeOptions,
  ): Promise<IncomeListItemDto>;
  public static async getFirstByType(
    type?: TransactionType.Transfer,
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransferListItemDto>;
  public static async getFirstByType(
    type?: null,
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransactionListItemDto>;
  public static async getFirstByType(
    type: TransactionType | null = null,
    options: FirstTransactionByTypeOptions = {},
  ): Promise<
    | TransactionListItemDto
    | ExpenseListItemDto
    | IncomeListItemDto
    | TransferListItemDto
  > {
    // For some reason ts fails to infer the type of the response so lets just cast as null
    const data = await this.getAllByType(type as null, {
      ...options,
      limit: 1,
      sortOrder: 'asc',
    });

    return data[0];
  }

  public static async getLatestByType(
    type?: TransactionType.Expense,
    options?: FirstTransactionByTypeOptions,
  ): Promise<ExpenseListItemDto>;
  public static async getLatestByType(
    type?: TransactionType.Income,
    options?: FirstTransactionByTypeOptions,
  ): Promise<IncomeListItemDto>;
  public static async getLatestByType(
    type?: TransactionType.Transfer,
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransferListItemDto>;
  public static async getLatestByType(
    type?: null,
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransactionListItemDto>;
  public static async getLatestByType(
    type: TransactionType | null = null,
    options: FirstTransactionByTypeOptions = {},
  ): Promise<
    | TransactionListItemDto
    | ExpenseListItemDto
    | IncomeListItemDto
    | TransferListItemDto
  > {
    // For some reason ts fails to infer the type of the response so lets just cast as null
    const data = await this.getAllByType(type as null, {
      ...options,
      limit: 1,
      sortOrder: 'desc',
    });

    return data[0];
  }

  public static async getAllByType(
    type: TransactionType.Expense,
    options?: TransactionListOptions,
  ): Promise<ExpenseListItemDto[]>;
  public static async getAllByType(
    type: TransactionType.Income,
    options?: TransactionListOptions,
  ): Promise<IncomeListItemDto[]>;
  public static async getAllByType(
    type: TransactionType.Transfer,
    options?: TransactionListOptions,
  ): Promise<TransferListItemDto[]>;
  public static async getAllByType(
    type: null,
    options?: TransactionListOptions,
  ): Promise<TransactionListItemDto[]>;
  public static async getAllByType(
    type: TransactionType | null,
    options: TransactionListOptions = {},
  ): Promise<
    | TransactionListItemDto[]
    | ExpenseListItemDto[]
    | IncomeListItemDto[]
    | TransferListItemDto[]
  > {
    if (type === TransactionType.Expense) {
      return ExpenseService.getAll(options);
    } else if (type === TransactionType.Income) {
      return IncomeService.getAll(options);
    } else if (type === TransactionType.Transfer) {
      return TransferService.getAll(options);
    }
    return this.getAll(options);
  }

  private static async getAll(
    options: TransactionListOptions,
  ): Promise<TransactionListItemDto[]> {
    const { data, error } = await this.client.GET('/api/transactions', {
      params: {
        query: options,
      },
      next: {
        tags: [
          this.API_TAG.TRANSACTION,
          this.API_TAG.EXPENSE,
          this.API_TAG.INCOME,
          this.API_TAG.TRANSFER,
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch transactions', error);
    }

    return data as unknown as TransactionListItemDto[];
  }

  public static async getById(id: string): Promise<TransactionDetailsDto> {
    const { data, error } = await this.client.GET(`/api/transactions/{id}`, {
      params: {
        path: {
          id,
        },
      },
      next: {
        tags: [
          this.getEntityTag(this.API_TAG.TRANSACTION, id),
          this.getEntityTag(this.API_TAG.EXPENSE, id),
          this.getEntityTag(this.API_TAG.INCOME, id),
          this.getEntityTag(this.API_TAG.TRANSFER, id),
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch transaction', error);
    }

    return data as TransactionDetailsDto;
  }
}
