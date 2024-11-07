import { revalidateTag } from 'next/cache';

import { AccountService } from './account.service';
import { BaseApi } from './base-api';
import type {
  FirstTransactionByTypeOptions,
  TransactionListOptions,
} from './transaction.service';

import {
  CreateExpenseDto,
  ExpenseDetailsDto,
  ExpenseListItemDto,
  SortOrder,
  UpdateExpenseDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { isValidationErrorResponse } from '$utils/apiHelper';
import { GenericTransactionListGroupDto } from 'src/types/transaction-list-group';

export class ExpenseService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static async clearCache(): Promise<void> {
    'use server';
    revalidateTag(this.API_TAG.EXPENSE);
  }

  public static async getFirst(
    options?: FirstTransactionByTypeOptions,
  ): Promise<ExpenseListItemDto> {
    const data = await this.getAll({
      ...options,
      limit: 1,
      sortOrder: SortOrder.Asc,
    });

    return data[0].data[0];
  }

  public static async getAll(
    options: TransactionListOptions,
  ): Promise<GenericTransactionListGroupDto<ExpenseListItemDto>[]> {
    const { data, error } = await this.client.GET('/api/expenses', {
      params: {
        query: options,
      },
      next: {
        tags: [
          this.API_TAG.EXPENSE,
          this.API_TAG.TRANSACTION,
          this.getListTag(this.API_TAG.EXPENSE),
          this.getListTag(this.API_TAG.TRANSACTION),
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch expenses', error);
    }

    return data as unknown as GenericTransactionListGroupDto<ExpenseListItemDto>[];
  }

  public static async getById(id: string): Promise<ExpenseDetailsDto> {
    const { data, error } = await this.client.GET(`/api/expenses/{id}`, {
      params: {
        path: {
          id,
        },
      },
      next: {
        tags: [
          this.API_TAG.TRANSACTION,
          this.API_TAG.EXPENSE,
          this.getEntityTag(this.API_TAG.TRANSACTION, id),
          this.getEntityTag(this.API_TAG.EXPENSE, id),
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch expense', error);
    }

    return data as ExpenseDetailsDto;
  }

  public static async add(
    newExpense: CreateExpenseDto,
  ): Promise<ExpenseDetailsDto> {
    const { error, data } = await this.client.POST('/api/expenses', {
      body: newExpense,
    });

    if (error) {
      // TODO ugly hack to handle missing types
      const unknownError = error as unknown;

      if (isValidationErrorResponse(unknownError)) {
        throw new ValidationException(
          'Failed to add expense',
          unknownError.message,
        );
      }

      throw new Error('Failed to add expense', error);
    }

    await this.clearCache();
    await AccountService.clearCache();

    return data as ExpenseDetailsDto;
  }

  public static async update(
    id: string,
    updatedExpense: UpdateExpenseDto,
  ): Promise<ExpenseDetailsDto> {
    const { error, data } = await this.client.PATCH(`/api/expenses/{id}`, {
      params: {
        path: { id },
      },
      body: updatedExpense,
    });

    if (error) {
      // TODO ugly hack to handle missing types
      const unknownError = error as unknown;

      if (isValidationErrorResponse(unknownError)) {
        throw new ValidationException(
          'Failed to add expense',
          unknownError.message,
        );
      }

      throw new Error('Failed to add expense', error);
    }

    await this.clearCache();
    await AccountService.clearCache();

    return data as ExpenseDetailsDto;
  }

  public static async delete(id: string): Promise<void> {
    const { error } = await this.client.DELETE(`/api/expenses/{id}`, {
      params: {
        path: { id },
      },
    });

    if (error) {
      throw new Error('Failed to delete expense', error);
    }

    await this.clearCache();
    await AccountService.clearCache();
  }
}
