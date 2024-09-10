import { revalidateTag } from 'next/cache';

import { BaseApi } from './base-api';

import { TransactionTemplateDto } from '$api/generated/financerApi';

export class TransactionTemplateService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static clearCache(): void {
    'use server';
    revalidateTag(this.API_TAG.TRANSACTION_TEMPLATE);
  }

  public static async getAll(): Promise<TransactionTemplateDto[]> {
    const { data, error } = await this.client.GET(
      '/api/transaction-templates',
      {
        next: {
          tags: [
            this.API_TAG.TRANSACTION_TEMPLATE,
            this.getListTag(this.API_TAG.TRANSACTION_TEMPLATE),
          ],
        },
      },
    );

    if (error) {
      throw new Error('Failed to fetch transaction templates', error);
    }

    return data as TransactionTemplateDto[];
  }

  public static async getById(id: string): Promise<TransactionTemplateDto> {
    const { data, error } = await this.client.GET(
      `/api/transaction-templates/{id}`,
      {
        params: {
          path: {
            id,
          },
        },
        next: {
          tags: [
            this.API_TAG.TRANSACTION_TEMPLATE,
            this.getEntityTag(this.API_TAG.TRANSACTION_TEMPLATE, id),
          ],
        },
      },
    );

    if (error) {
      throw new Error('Failed to fetch transaction template', error);
    }

    return data as TransactionTemplateDto;
  }
}
