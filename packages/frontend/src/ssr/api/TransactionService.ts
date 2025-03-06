import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';
import { ExpenseService } from './ExpenseService';
import { IncomeService } from './IncomeService';
import { TransferService } from './TransferService';

import {
  SchemaExpenseListItemDto,
  SchemaIncomeListItemDto,
  SchemaTransactionDetailsDto,
  SchemaTransactionListItemDto,
  SchemaTransactionMonthSummaryDto,
  SchemaTransferListItemDto,
  SortOrder,
  TransactionType,
  operations,
} from '@/api/ssr-financer-api';

export type TransactionListOptions =
  operations['Transactions_findAllByUser']['parameters']['query'];

export type FirstTransactionByTypeOptions = Omit<
  TransactionListOptions,
  'limit' | 'sortOrder'
>;

export class TransactionService extends BaseApi {
  public static revalidateCache(id?: string): void {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.TRANSACTION, id));
      return;
    }

    revalidateTag(this.API_TAG.TRANSACTION);
  }

  public static async getMonthlySummary(
    params: operations['Transactions_findMonthlySummariesByUser']['parameters']['query'],
  ): Promise<readonly SchemaTransactionMonthSummaryDto[]> {
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
    type?: TransactionType.EXPENSE,
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaExpenseListItemDto | null>;
  public static async getFirstByType(
    type?: TransactionType.INCOME,
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaIncomeListItemDto | null>;
  public static async getFirstByType(
    type?: TransactionType.TRANSFER,
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaTransferListItemDto | null>;
  public static async getFirstByType(
    type?: null,
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaTransactionListItemDto | null>;
  public static async getFirstByType(
    type: TransactionType | null = null,
    options: FirstTransactionByTypeOptions = {},
  ): Promise<
    | SchemaTransactionListItemDto
    | SchemaExpenseListItemDto
    | SchemaIncomeListItemDto
    | SchemaTransferListItemDto
    | null
  > {
    // @ts-expect-error - TS is not able to infer the type of data with null overload
    const data = await this.getAllByType(type, {
      ...options,
      limit: 1,
      sortOrder: SortOrder.asc,
    });

    return data.at(0) ?? null;
  }

  public static async getLatestByType(
    type?: TransactionType.EXPENSE,
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaExpenseListItemDto | null>;
  public static async getLatestByType(
    type?: TransactionType.INCOME,
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaIncomeListItemDto | null>;
  public static async getLatestByType(
    type?: TransactionType.TRANSFER,
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaTransferListItemDto | null>;
  public static async getLatestByType(
    type?: null,
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaTransactionListItemDto | null>;
  public static async getLatestByType(
    type: TransactionType | null = null,
    options: FirstTransactionByTypeOptions = {},
  ): Promise<
    | SchemaTransactionListItemDto
    | SchemaExpenseListItemDto
    | SchemaIncomeListItemDto
    | SchemaTransferListItemDto
    | null
  > {
    // @ts-expect-error - TS is not able to infer the type of data with null overload
    const data = await this.getAllByType(type, {
      ...options,
      limit: 1,
      sortOrder: SortOrder.desc,
    });

    return data.at(0) ?? null;
  }

  public static async getAllByType(
    type: TransactionType.EXPENSE,
    options?: TransactionListOptions,
  ): Promise<SchemaExpenseListItemDto[]>;
  public static async getAllByType(
    type: TransactionType.INCOME,
    options?: TransactionListOptions,
  ): Promise<SchemaIncomeListItemDto[]>;
  public static async getAllByType(
    type: TransactionType.TRANSFER,
    options?: TransactionListOptions,
  ): Promise<SchemaTransferListItemDto[]>;
  public static async getAllByType(
    type: null,
    options?: TransactionListOptions,
  ): Promise<SchemaTransactionListItemDto[]>;
  public static async getAllByType(
    type: TransactionType | null,
    options: TransactionListOptions = {},
  ): Promise<
    | SchemaTransactionListItemDto[]
    | SchemaExpenseListItemDto[]
    | SchemaIncomeListItemDto[]
    | SchemaTransferListItemDto[]
  > {
    if (type === TransactionType.EXPENSE) {
      return ExpenseService.getAll(options);
    } else if (type === TransactionType.INCOME) {
      return IncomeService.getAll(options);
    } else if (type === TransactionType.TRANSFER) {
      return TransferService.getAll(options);
    }
    return this.getAll(options);
  }

  private static async getAll(
    options: TransactionListOptions,
  ): Promise<SchemaTransactionListItemDto[]> {
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

    return data as unknown as SchemaTransactionListItemDto[];
  }

  public static async getById(
    id: string,
  ): Promise<SchemaTransactionDetailsDto> {
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

    return data;
  }
}
