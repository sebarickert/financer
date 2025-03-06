import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';
import type {
  FirstTransactionByTypeOptions,
  TransactionListOptions,
} from './TransactionService';

import {
  SchemaCreateIncomeDto,
  SchemaIncomeDetailsDto,
  SchemaIncomeListItemDto,
  SchemaUpdateIncomeDto,
  SortOrder,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

export class IncomeService extends BaseApi {
  public static revalidateCache(id?: string): void {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.INCOME, id));
      return;
    }

    revalidateTag(this.API_TAG.INCOME);
  }

  public static async getFirst(
    options?: FirstTransactionByTypeOptions,
  ): Promise<SchemaIncomeListItemDto> {
    const data = await this.getAll({
      ...options,
      limit: 1,
      sortOrder: SortOrder.asc,
    });

    return data[0];
  }

  public static async getAll(
    options: TransactionListOptions,
  ): Promise<SchemaIncomeDetailsDto[]> {
    const { data, error } = await this.client.GET('/api/incomes', {
      params: {
        query: options,
      },
      next: {
        tags: [this.API_TAG.INCOME],
      },
    });

    if (error) {
      throw new Error('Failed to fetch incomes', error);
    }

    return data as SchemaIncomeDetailsDto[];
  }

  public static async getById(id: string): Promise<SchemaIncomeDetailsDto> {
    const { data, error } = await this.client.GET(`/api/incomes/{id}`, {
      params: {
        path: {
          id,
        },
      },
      next: {
        tags: [this.getEntityTag(this.API_TAG.INCOME, id)],
      },
    });

    if (error) {
      throw new Error('Failed to fetch income', error);
    }

    return data;
  }

  public static async add(
    newIncome: SchemaCreateIncomeDto,
  ): Promise<SchemaIncomeDetailsDto> {
    const { error, data } = await this.client.POST('/api/incomes', {
      body: newIncome,
    });

    if (error) {
      // TODO ugly hack to handle missing types
      const unknownError = error as unknown;

      if (isValidationErrorResponse(unknownError)) {
        throw new ValidationException(
          'Failed to add income',
          unknownError.message,
        );
      }

      throw new Error('Failed to add income', error);
    }

    this.revalidateCache();

    return data;
  }

  public static async update(
    id: string,
    updatedIncome: SchemaUpdateIncomeDto,
  ): Promise<SchemaIncomeDetailsDto> {
    const { error, data } = await this.client.PATCH(`/api/incomes/{id}`, {
      params: {
        path: { id },
      },
      body: updatedIncome,
    });

    if (error) {
      // TODO ugly hack to handle missing types
      const unknownError = error as unknown;

      if (isValidationErrorResponse(unknownError)) {
        throw new ValidationException(
          'Failed to add income',
          unknownError.message,
        );
      }

      throw new Error('Failed to add income', error);
    }

    this.revalidateCache(id);
    this.revalidateCache();

    return data;
  }

  public static async delete(id: string): Promise<void> {
    const { error } = await this.client.DELETE(`/api/incomes/{id}`, {
      params: {
        path: { id },
      },
    });

    if (error) {
      throw new Error('Failed to delete income', error);
    }

    this.revalidateCache();
  }
}
