import { revalidateTag } from 'next/cache';

import { AccountService } from './account.service';
import { BaseApi } from './base-api';
import type {
  FirstTransactionByTypeOptions,
  TransactionListOptions,
} from './transaction.service';

import {
  TransferDto,
  SortOrder,
  CreateTransferDto,
  UpdateTransferDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { isValidationErrorResponse } from '$utils/apiHelper';
import { GenericPaginationDto } from 'src/types/pagination.dto';

export class TransferService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static async clearCache(): Promise<void> {
    'use server';
    revalidateTag(this.API_TAG.TRANSFER);
  }

  public static async getFirst(
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransferDto> {
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
  ): Promise<GenericPaginationDto<TransferDto>> {
    const { data, error } = await this.client.GET('/api/transfers', {
      params: {
        query: options,
      },
      next: {
        tags: [
          this.API_TAG.TRANSFER,
          this.API_TAG.TRANSACTION,
          this.getListTag(this.API_TAG.TRANSFER),
          this.getListTag(this.API_TAG.TRANSACTION),
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch transfers', error);
    }

    return data;
  }

  public static async getById(id: string): Promise<TransferDto> {
    const { data, error } = await this.client.GET(`/api/transfers/{id}`, {
      params: {
        path: {
          id,
        },
      },
      next: {
        tags: [
          this.API_TAG.TRANSACTION,
          this.API_TAG.TRANSFER,
          this.getEntityTag(this.API_TAG.TRANSACTION, id),
          this.getEntityTag(this.API_TAG.TRANSFER, id),
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch transfer', error);
    }

    return data as TransferDto;
  }

  public static async add(
    newTransfer: CreateTransferDto,
  ): Promise<TransferDto> {
    const { error, data } = await this.client.POST('/api/transfers', {
      body: newTransfer,
    });

    if (error) {
      // TODO ugly hack to handle missing types
      const unknownError = error as unknown;

      if (isValidationErrorResponse(unknownError)) {
        throw new ValidationException(
          'Failed to add transfer',
          unknownError.message,
        );
      }

      throw new Error('Failed to add transfer', error);
    }

    await this.clearCache();
    await AccountService.clearCache();

    return data;
  }

  public static async update(
    id: string,
    updatedTransfer: UpdateTransferDto,
  ): Promise<TransferDto> {
    const { error, data } = await this.client.PATCH(`/api/transfers/{id}`, {
      params: {
        path: { id },
      },
      body: updatedTransfer,
    });

    if (error) {
      // TODO ugly hack to handle missing types
      const unknownError = error as unknown;

      if (isValidationErrorResponse(unknownError)) {
        throw new ValidationException(
          'Failed to update transfer',
          unknownError.message,
        );
      }

      throw new Error('Failed to update transfer', error);
    }

    await this.clearCache();
    await AccountService.clearCache();

    return data;
  }

  public static async delete(id: string): Promise<void> {
    const { error } = await this.client.DELETE(`/api/transfers/{id}`, {
      params: {
        path: { id },
      },
    });

    if (error) {
      throw new Error('Failed to delete transfer', error);
    }

    await this.clearCache();
    await AccountService.clearCache();
  }
}
