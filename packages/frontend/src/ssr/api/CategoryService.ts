import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';

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

export class CategoryService extends BaseApi {
  public static revalidateCache(id?: string): void {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.CATEGORY, id));
      return;
    }

    revalidateTag(this.API_TAG.CATEGORY);
  }

  public static async getNameById(id: string): Promise<string | undefined> {
    const categories = await this.getAll();

    return categories.find((category) => category.id === id)?.name;
  }

  public static async getAll(
    options: operations['TransactionCategories_findAllByUser']['parameters']['query'] = {},
  ): Promise<readonly SchemaTransactionCategoryDetailsDto[]> {
    const { data, error } = await this.client.GET(
      '/api/transaction-categories',
      {
        params: {
          query: options,
        },
        next: {
          tags: [this.API_TAG.CATEGORY],
        },
      },
    );

    if (error) {
      throw new Error('Failed to fetch categories', error);
    }

    return data;
  }

  public static async getAllWithTree(
    options: operations['TransactionCategories_findAllByUser']['parameters']['query'] = {},
  ): Promise<TransactionCategoryDtoWithCategoryTree[]> {
    const [categories, allCategories] = await Promise.all([
      this.getAll(options),
      this.getAll(),
    ]);

    return categories
      .map((category) => ({
        ...category,
        categoryTree: parseParentCategoryPath(allCategories, category.id),
      }))
      .sort((a, b) => a.categoryTree.localeCompare(b.categoryTree));
  }

  public static async getById(
    id: string,
  ): Promise<SchemaTransactionCategoryDto> {
    const { data, error } = await this.client.GET(
      `/api/transaction-categories/{id}`,
      {
        params: {
          path: {
            id,
          },
        },
        next: {
          tags: [this.getEntityTag(this.API_TAG.CATEGORY, id)],
        },
      },
    );

    if (error) {
      throw new Error('Failed to fetch category', error);
    }

    return data as SchemaTransactionCategoryDto;
  }

  public static async add(
    newCategory: SchemaCreateTransactionCategoryDto,
  ): Promise<void> {
    const { error } = await this.client.POST('/api/transaction-categories', {
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

    this.revalidateCache();
  }

  public static async update(
    id: string,
    updatedCategory: SchemaUpdateTransactionCategoryDto,
  ): Promise<void> {
    const { error } = await this.client.PATCH(
      `/api/transaction-categories/{id}`,
      {
        params: {
          path: { id },
        },
        body: updatedCategory,
      },
    );

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

    this.revalidateCache(id);
    this.revalidateCache();
  }

  public static async delete(id: string): Promise<void> {
    const { error } = await this.client.DELETE(
      `/api/transaction-categories/{id}`,
      {
        params: {
          path: { id },
        },
      },
    );

    if (error) {
      throw new Error('Failed to delete category', error);
    }

    this.revalidateCache();
  }
}
