'use server';

import { revalidateTag } from 'next/cache';

import { client } from './ApiClient';
import { API_TAG, getEntityTag } from './ApiTags';
import type {
  FirstTransactionByTypeOptions,
  TransactionListOptions,
} from './TransactionService';

import {
  SchemaCreateTransferDto,
  SchemaTransferDetailsDto,
  SchemaTransferListItemDto,
  SchemaUpdateTransferDto,
  SortOrder,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateTransferCache = async (id?: string): Promise<void> => {
  if (id) {
    revalidateTag(getEntityTag(API_TAG.TRANSFER, id));
    return;
  }

  revalidateTag(API_TAG.TRANSFER);
};

export const getFirstTransfer = async (
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaTransferListItemDto> => {
  const data = await getAllTransfers({
    ...options,
    limit: 1,
    sortOrder: SortOrder.asc,
  });

  return data[0];
};

export const getAllTransfers = async (
  options: TransactionListOptions,
): Promise<SchemaTransferListItemDto[]> => {
  const { data, error } = await client.GET('/api/transfers', {
    params: {
      query: options,
    },
    next: {
      tags: [API_TAG.TRANSFER],
    },
  });

  if (error) {
    throw new Error('Failed to fetch transfers', error);
  }

  return data as SchemaTransferListItemDto[];
};

export const getTransferById = async (
  id: string,
): Promise<SchemaTransferDetailsDto> => {
  const { data, error } = await client.GET(`/api/transfers/{id}`, {
    params: {
      path: {
        id,
      },
    },
    next: {
      tags: [getEntityTag(API_TAG.TRANSFER, id)],
    },
  });

  if (error) {
    throw new Error('Failed to fetch transfer', error);
  }

  return data;
};

export const addTransfer = async (
  newTransfer: SchemaCreateTransferDto,
): Promise<SchemaTransferDetailsDto> => {
  const { error, data } = await client.POST('/api/transfers', {
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

  await revalidateTransferCache();

  return data;
};

export const updateTransfer = async (
  id: string,
  updatedTransfer: SchemaUpdateTransferDto,
): Promise<SchemaTransferDetailsDto> => {
  const { error, data } = await client.PATCH(`/api/transfers/{id}`, {
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

  await revalidateTransferCache(id);
  await revalidateTransferCache();

  return data;
};

export const deleteTransfer = async (id: string): Promise<void> => {
  const { error } = await client.DELETE(`/api/transfers/{id}`, {
    params: {
      path: { id },
    },
  });

  if (error) {
    throw new Error('Failed to delete transfer', error);
  }

  await revalidateTransferCache();
};
