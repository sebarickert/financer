import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';
import {
  type FirstTransactionByTypeOptions,
  type TransactionListOptions,
} from './TransactionService';

import {
  SchemaCreateExpenseDto,
  SchemaExpenseDetailsDto,
  SchemaExpenseListItemDto,
  SchemaUpdateExpenseDto,
  SortOrder,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

export class ExpenseService extends BaseApi {
  public static revalidateCache(id?: string): void {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.EXPENSE, id));
      return;
    }

    revalidateTag(this.API_TAG.EXPENSE);
  }

  public static async getFirst(
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaExpenseListItemDto> {
    const data = await this.getAll({
      ...options,
      limit: 1,
      sortOrder: SortOrder.asc,
    });

    return data[0];
  }

  public static async getAll(
    options: TransactionListOptions,
  ): Promise<SchemaExpenseListItemDto[]> {
    const { data, error } = await this.client.GET('/api/expenses', {
      params: {
        query: options,
      },
      next: {
        tags: [this.API_TAG.EXPENSE],
      },
    });

    if (error) {
      throw new Error('Failed to fetch expenses', error);
    }

    return data as SchemaExpenseListItemDto[];
  }

  public static async getById(id: string): Promise<SchemaExpenseDetailsDto> {
    const { data, error } = await this.client.GET(`/api/expenses/{id}`, {
      params: {
        path: {
          id,
        },
      },
      next: {
        tags: [this.getEntityTag(this.API_TAG.EXPENSE, id)],
      },
    });

    if (error) {
      throw new Error('Failed to fetch expense', error);
    }

    return data;
  }

  public static async add(
    newExpense: SchemaCreateExpenseDto,
  ): Promise<SchemaExpenseDetailsDto> {
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

    this.revalidateCache();

    return data;
  }

  public static async update(
    id: string,
    updatedExpense: SchemaUpdateExpenseDto,
  ): Promise<SchemaExpenseDetailsDto> {
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

    this.revalidateCache(id);
    this.revalidateCache();

    return data;
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

    this.revalidateCache();
  }
}
