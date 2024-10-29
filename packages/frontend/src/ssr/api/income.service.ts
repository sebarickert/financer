import { revalidateTag } from 'next/cache';

import { AccountService } from './account.service';
import { BaseApi } from './base-api';
import type {
  FirstTransactionByTypeOptions,
  TransactionListOptions,
} from './transaction.service';

import {
  CreateIncomeDto,
  IncomeDetailsDto,
  IncomeListItemDto,
  SortOrder,
  UpdateIncomeDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { isValidationErrorResponse } from '$utils/apiHelper';
import { GenericPaginationDto } from 'src/types/pagination.dto';

export class IncomeService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static async clearCache(): Promise<void> {
    'use server';
    revalidateTag(this.API_TAG.INCOME);
  }

  public static async getFirst(
    options?: FirstTransactionByTypeOptions,
  ): Promise<IncomeListItemDto> {
    const data = await this.getAll({
      ...options,
      limit: 1,
      page: 1,
      sortOrder: SortOrder.Asc,
    });

    return data.data[0];
  }

  public static async getAll(
    options: TransactionListOptions,
  ): Promise<GenericPaginationDto<IncomeDetailsDto>> {
    const { data, error } = await this.client.GET('/api/incomes', {
      params: {
        query: options,
      },
      next: {
        tags: [
          this.API_TAG.INCOME,
          this.API_TAG.TRANSACTION,
          this.getListTag(this.API_TAG.INCOME),
          this.getListTag(this.API_TAG.TRANSACTION),
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch incomes', error);
    }

    return data as GenericPaginationDto<IncomeDetailsDto>;
  }

  public static async getById(id: string): Promise<IncomeDetailsDto> {
    const { data, error } = await this.client.GET(`/api/incomes/{id}`, {
      params: {
        path: {
          id,
        },
      },
      next: {
        tags: [
          this.API_TAG.TRANSACTION,
          this.API_TAG.INCOME,
          this.getEntityTag(this.API_TAG.TRANSACTION, id),
          this.getEntityTag(this.API_TAG.INCOME, id),
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch income', error);
    }

    return data as IncomeDetailsDto;
  }

  public static async add(
    newIncome: CreateIncomeDto,
  ): Promise<IncomeDetailsDto> {
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

    await this.clearCache();
    await AccountService.clearCache();

    return data as IncomeDetailsDto;
  }

  public static async update(
    id: string,
    updatedIncome: UpdateIncomeDto,
  ): Promise<IncomeDetailsDto> {
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

    await this.clearCache();
    await AccountService.clearCache();

    return data as IncomeDetailsDto;
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

    await this.clearCache();
    await AccountService.clearCache();
  }
}
