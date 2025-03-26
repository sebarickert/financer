'use server';

import { revalidateTag } from 'next/cache';

import { client } from './ApiClient';
import { API_TAG, getEntityTag } from './ApiTags';

import {
  SchemaCreateTransactionCategoryDto,
  SchemaTransactionCategoryDetailsDto,
  SchemaTransactionCategoryDto,
  SchemaUpdateTransactionCategoryDto,
  operations,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { TransactionCategoryDtoWithCategoryTree } from '@/types/TransactionCategoryDtoWithCategoryTree';
import { isValidationErrorResponse } from '@/utils/apiHelper';
import { parseParentCategoryPath } from 'src/services/TransactionCategoriesService';

// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateCategoryCache = async (id?: string): Promise<void> => {
  if (id) {
    revalidateTag(getEntityTag(API_TAG.CATEGORY, id));
    return;
  }
  revalidateTag(API_TAG.CATEGORY);
};

export const getCategoryNameById = async (
  id: string,
): Promise<string | undefined> => {
  const categories = await getAllCategories();

  return categories.find((category) => category.id === id)?.name;
};

export const getAllCategories = async (
  options: operations['TransactionCategories_findAllByUser']['parameters']['query'] = {},
): Promise<readonly SchemaTransactionCategoryDetailsDto[]> => {
  const { data, error } = await client.GET('/api/transaction-categories', {
    params: {
      query: options,
    },
    next: {
      tags: [API_TAG.CATEGORY],
    },
  });

  if (error) {
    throw new Error('Failed to fetch categories', error);
  }

  return data;
};

export const getAllCategoriesWithTree = async (
  options: operations['TransactionCategories_findAllByUser']['parameters']['query'] = {},
): Promise<TransactionCategoryDtoWithCategoryTree[]> => {
  const [categories, allCategories] = await Promise.all([
    getAllCategories(options),
    getAllCategories(),
  ]);

  return categories
    .map((category) => ({
      ...category,
      categoryTree: parseParentCategoryPath(allCategories, category.id),
    }))
    .sort((a, b) => a.categoryTree.localeCompare(b.categoryTree));
};

export const getCategoryById = async (
  id: string,
): Promise<SchemaTransactionCategoryDto> => {
  const { data, error } = await client.GET(`/api/transaction-categories/{id}`, {
    params: {
      path: {
        id,
      },
    },
    next: {
      tags: [getEntityTag(API_TAG.CATEGORY, id)],
    },
  });

  if (error) {
    throw new Error('Failed to fetch category', error);
  }

  return data as SchemaTransactionCategoryDto;
};

export const addCategory = async (
  newCategory: SchemaCreateTransactionCategoryDto,
): Promise<void> => {
  const { error } = await client.POST('/api/transaction-categories', {
    body: newCategory,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add account',
        unknownError.message,
      );
    }

    throw new Error('Failed to add account', error);
  }

  await revalidateCategoryCache();
};

export const updateCategory = async (
  id: string,
  updatedCategory: SchemaUpdateTransactionCategoryDto,
): Promise<void> => {
  const { error } = await client.PATCH(`/api/transaction-categories/{id}`, {
    params: {
      path: { id },
    },
    body: updatedCategory,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add account',
        unknownError.message,
      );
    }

    throw new Error('Failed to add account', error);
  }

  await revalidateCategoryCache(id);
  await revalidateCategoryCache();
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await client.DELETE(`/api/transaction-categories/{id}`, {
    params: {
      path: { id },
    },
  });

  if (error) {
    throw new Error('Failed to delete category', error);
  }

  await revalidateCategoryCache();
};
