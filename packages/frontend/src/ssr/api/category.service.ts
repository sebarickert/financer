import { revalidateTag } from 'next/cache';

import { BaseApi } from './base-api';

import { TransactionCategoryDto } from '$api/generated/financerApi';

export class CategoryService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static clearCache(): void {
    'use server';
    revalidateTag(this.API_TAG.CATEGORY);
  }

  public static async getNameById(id: string): Promise<string | undefined> {
    const categories = await this.getAll();

    return categories.find((category) => category.id === id)?.name;
  }

  public static async getAll(): Promise<TransactionCategoryDto[]> {
    const { data, error } = await this.client.GET(
      '/api/transaction-categories',
      {
        next: {
          tags: [this.API_TAG.CATEGORY, this.getListTag(this.API_TAG.CATEGORY)],
        },
      },
    );

    if (error) {
      throw new Error('Failed to fetch categories', error);
    }

    return data as TransactionCategoryDto[];
  }

  public static async getById(id: string): Promise<TransactionCategoryDto> {
    const { data, error } = await this.client.GET(
      `/api/transaction-categories/{id}`,
      {
        params: {
          path: {
            id,
          },
        },
        next: {
          tags: [
            this.API_TAG.CATEGORY,
            this.getEntityTag(this.API_TAG.CATEGORY, id),
          ],
        },
      },
    );

    if (error) {
      throw new Error('Failed to fetch category', error);
    }

    return data as TransactionCategoryDto;
  }
}
