import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';

import {
  CreateTransactionTemplateDto,
  TransactionTemplateDto,
  UpdateTransactionTemplateDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { isValidationErrorResponse } from '$utils/apiHelper';

export class TransactionTemplateService extends BaseApi {
  public static async revalidateCache(id?: string): Promise<void> {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.TRANSACTION_TEMPLATE, id));
      return;
    }

    revalidateTag(this.API_TAG.TRANSACTION_TEMPLATE);
  }

  public static async getAll(): Promise<TransactionTemplateDto[]> {
    const { data, error } = await this.client.GET(
      '/api/transaction-templates',
      {
        next: {
          tags: [this.API_TAG.TRANSACTION_TEMPLATE],
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
          tags: [this.getEntityTag(this.API_TAG.TRANSACTION_TEMPLATE, id)],
        },
      },
    );

    if (error) {
      throw new Error('Failed to fetch transaction template', error);
    }

    return data as TransactionTemplateDto;
  }

  public static async add(
    newTransactionTemplate: CreateTransactionTemplateDto,
  ): Promise<void> {
    const { error } = await this.client.POST('/api/transaction-templates', {
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

    await this.revalidateCache();
  }

  public static async update(
    id: string,
    updatedTransactionTemplate: UpdateTransactionTemplateDto,
  ): Promise<void> {
    const { error } = await this.client.PATCH(
      `/api/transaction-templates/{id}`,
      {
        params: {
          path: { id },
        },
        body: updatedTransactionTemplate,
      },
    );

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

    this.revalidateCache(id);
    this.revalidateCache();
  }

  public static async delete(id: string): Promise<void> {
    const { error } = await this.client.DELETE(
      `/api/transaction-templates/{id}`,
      {
        params: {
          path: { id },
        },
      },
    );

    if (error) {
      throw new Error('Failed to delete transaction template', error);
    }

    await this.revalidateCache();
  }
}
