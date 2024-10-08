import { revalidateTag } from 'next/cache';

import { BaseApi } from './base-api';
import { ExpenseService } from './expense.service ';
import { IncomeService } from './income.service';
import { TransferService } from './transfer.service';

import {
  ExpenseDto,
  IncomeDto,
  SortOrder,
  TransactionDto,
  TransactionMonthSummaryDto,
  TransactionsFindAllByUserApiArg,
  TransactionsFindMonthlySummariesByUserApiArg,
  TransactionType,
  TransferDto,
} from '$api/generated/financerApi';
import { GenericPaginationDto } from 'src/types/pagination.dto';

export type TransactionListOptions = TransactionsFindAllByUserApiArg;

export type FirstTransactionByTypeOptions = Omit<
  TransactionListOptions,
  'limit' | 'page' | 'sortOrder'
>;

export class TransactionService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static async clearCache(): Promise<void> {
    'use server';
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
            this.getSummaryTag(this.API_TAG.TRANSACTION),
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
  ): Promise<ExpenseDto>;
  public static async getFirstByType(
    type?: TransactionType.Income,
    options?: FirstTransactionByTypeOptions,
  ): Promise<IncomeDto>;
  public static async getFirstByType(
    type?: TransactionType.Transfer,
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransferDto>;
  public static async getFirstByType(
    type?: null,
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransactionDto>;
  public static async getFirstByType(
    type: TransactionType | null = null,
    options: FirstTransactionByTypeOptions = {},
  ): Promise<TransactionDto | ExpenseDto | IncomeDto | TransferDto> {
    // For some reason ts fails to infer the type of the response so lets just cast as null
    const data = await this.getAllByType(type as null, {
      ...options,
      limit: 1,
      page: 1,
      sortOrder: SortOrder.Asc,
    });

    return data.data[0];
  }

  public static async getLatestByType(
    type?: TransactionType.Expense,
    options?: FirstTransactionByTypeOptions,
  ): Promise<ExpenseDto>;
  public static async getLatestByType(
    type?: TransactionType.Income,
    options?: FirstTransactionByTypeOptions,
  ): Promise<IncomeDto>;
  public static async getLatestByType(
    type?: TransactionType.Transfer,
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransferDto>;
  public static async getLatestByType(
    type?: null,
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransactionDto>;
  public static async getLatestByType(
    type: TransactionType | null = null,
    options: FirstTransactionByTypeOptions = {},
  ): Promise<TransactionDto | ExpenseDto | IncomeDto | TransferDto> {
    // For some reason ts fails to infer the type of the response so lets just cast as null
    const data = await this.getAllByType(type as null, {
      ...options,
      limit: 1,
      page: 1,
      sortOrder: SortOrder.Desc,
    });

    return data.data[0];
  }

  public static async getAllByType(
    type: TransactionType.Expense,
    options?: TransactionListOptions,
  ): Promise<GenericPaginationDto<ExpenseDto>>;
  public static async getAllByType(
    type: TransactionType.Income,
    options?: TransactionListOptions,
  ): Promise<GenericPaginationDto<IncomeDto>>;
  public static async getAllByType(
    type: TransactionType.Transfer,
    options?: TransactionListOptions,
  ): Promise<GenericPaginationDto<TransferDto>>;
  public static async getAllByType(
    type: null,
    options?: TransactionListOptions,
  ): Promise<GenericPaginationDto<TransactionDto>>;
  public static async getAllByType(
    type: TransactionType | null,
    options: TransactionListOptions = {},
  ): Promise<
    | GenericPaginationDto<TransactionDto>
    | GenericPaginationDto<ExpenseDto>
    | GenericPaginationDto<IncomeDto>
    | GenericPaginationDto<TransferDto>
  > {
    if (type === TransactionType.Expense) {
      return ExpenseService.getAll(options);
    } else if (type === TransactionType.Income) {
      return IncomeService.getAll(options);
    } else if (type === TransactionType.Transfer) {
      return TransferService.getAll(options);
    } else {
      return this.getAll(options);
    }
  }

  private static async getAll(
    options: TransactionListOptions,
  ): Promise<GenericPaginationDto<TransactionDto>> {
    const { data, error } = await this.client.GET('/api/transactions', {
      params: {
        query: options,
      },
      next: {
        tags: [
          this.API_TAG.TRANSACTION,
          this.getListTag(this.API_TAG.TRANSACTION),
          this.API_TAG.EXPENSE,
          this.getListTag(this.API_TAG.EXPENSE),
          this.API_TAG.INCOME,
          this.getListTag(this.API_TAG.INCOME),
          this.API_TAG.TRANSFER,
          this.getListTag(this.API_TAG.TRANSFER),
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch transactions', error);
    }

    return data;
  }

  public static async getById(id: string): Promise<TransactionDto> {
    const { data, error } = await this.client.GET(`/api/transactions/{id}`, {
      params: {
        path: {
          id,
        },
      },
      next: {
        tags: [
          this.API_TAG.TRANSACTION,
          this.API_TAG.EXPENSE,
          this.API_TAG.INCOME,
          this.API_TAG.TRANSFER,
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

    return data as TransactionDto;
  }
}
