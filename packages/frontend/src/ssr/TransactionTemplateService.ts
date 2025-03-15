'use server';

import { revalidateTag } from 'next/cache';

import { client } from './ApiClient';
import { API_TAG, getEntityTag } from './ApiTags';

import {
  SchemaCreateTransactionTemplateDto,
  SchemaTransactionTemplateDto,
  SchemaUpdateTransactionTemplateDto,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

export const revalidateTransactionTemplateCache = async (
  id?: string,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<void> => {
  if (id) {
    revalidateTag(getEntityTag(API_TAG.TRANSACTION_TEMPLATE, id));
    return;
  }

  revalidateTag(API_TAG.TRANSACTION_TEMPLATE);
};

export const getAllTransactionTemplates = async (): Promise<
  SchemaTransactionTemplateDto[]
> => {
  const { data, error } = await client.GET('/api/transaction-templates', {
    next: {
      tags: [API_TAG.TRANSACTION_TEMPLATE],
    },
  });

  if (error) {
    throw new Error('Failed to fetch transaction templates', error);
  }

  return data as SchemaTransactionTemplateDto[];
};

export const getTransactionTemplateById = async (
  id: string,
): Promise<SchemaTransactionTemplateDto> => {
  const { data, error } = await client.GET(`/api/transaction-templates/{id}`, {
    params: {
      path: {
        id,
      },
    },
    next: {
      tags: [getEntityTag(API_TAG.TRANSACTION_TEMPLATE, id)],
    },
  });

  if (error) {
    throw new Error('Failed to fetch transaction template', error);
  }

  return data;
};

export const addTransactionTemplate = async (
  newTransactionTemplate: SchemaCreateTransactionTemplateDto,
): Promise<void> => {
  const { error } = await client.POST('/api/transaction-templates', {
    body: newTransactionTemplate,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add transaction template',
        unknownError.message,
      );
    }

    throw new Error('Failed to add transaction template', error);
  }

  await revalidateTransactionTemplateCache();
};

export const updateTransactionTemplate = async (
  id: string,
  updatedTransactionTemplate: SchemaUpdateTransactionTemplateDto,
): Promise<void> => {
  const { error } = await client.PATCH(`/api/transaction-templates/{id}`, {
    params: {
      path: { id },
    },
    body: updatedTransactionTemplate,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add transaction template',
        unknownError.message,
      );
    }

    throw new Error('Failed to update transaction template', error);
  }

  await revalidateTransactionTemplateCache(id);
  await revalidateTransactionTemplateCache();
};

export const deleteTransactionTemplate = async (id: string): Promise<void> => {
  const { error } = await client.DELETE(`/api/transaction-templates/{id}`, {
    params: {
      path: { id },
    },
  });

  if (error) {
    throw new Error('Failed to delete transaction template', error);
  }

  await revalidateTransactionTemplateCache();
};
