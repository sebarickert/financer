import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';
import type {
  FirstTransactionByTypeOptions,
  TransactionListOptions,
} from './TransactionService';

import {
  CreateTransferDto,
  SortOrder,
  TransferDetailsDto,
  TransferListItemDto,
  UpdateTransferDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { isValidationErrorResponse } from '$utils/apiHelper';

export class TransferService extends BaseApi {
  public static async revalidateCache(id?: string): Promise<void> {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.TRANSFER, id));
      return;
    }

    revalidateTag(this.API_TAG.TRANSFER);
  }

  public static async getFirst(
    options?: FirstTransactionByTypeOptions,
  ): Promise<TransferListItemDto> {
    const data = await this.getAll({
      ...options,
      limit: 1,
      sortOrder: SortOrder.Asc,
    });

    return data[0];
  }

  public static async getAll(
    options: TransactionListOptions,
  ): Promise<TransferListItemDto[]> {
    const { data, error } = await this.client.GET('/api/transfers', {
      params: {
        query: options,
      },
      next: {
        tags: [this.API_TAG.TRANSFER],
      },
    });

    if (error) {
      throw new Error('Failed to fetch transfers', error);
    }

    return data as TransferListItemDto[];
  }

  public static async getById(id: string): Promise<TransferDetailsDto> {
    const { data, error } = await this.client.GET(`/api/transfers/{id}`, {
      params: {
        path: {
          id,
        },
      },
      next: {
        tags: [this.getEntityTag(this.API_TAG.TRANSFER, id)],
      },
    });

    if (error) {
      throw new Error('Failed to fetch transfer', error);
    }

    return data as TransferDetailsDto;
  }

  public static async add(
    newTransfer: CreateTransferDto,
  ): Promise<TransferDetailsDto> {
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

    await this.revalidateCache();

    return data as TransferDetailsDto;
  }

  public static async update(
    id: string,
    updatedTransfer: UpdateTransferDto,
  ): Promise<TransferDetailsDto> {
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

    await this.revalidateCache(id);
    await this.revalidateCache();

    return data as TransferDetailsDto;
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

    await this.revalidateCache();
  }
}
