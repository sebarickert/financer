import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';

import {
  SchemaAccountBalanceHistoryDto,
  SchemaAccountDto,
  SchemaCreateAccountDto,
  SchemaUpdateAccountDto,
  operations,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

export class AccountService extends BaseApi {
  public static revalidateCache(id?: string): void {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.ACCOUNT, id));
      return;
    }

    revalidateTag(this.API_TAG.ACCOUNT);
  }

  public static async getAll(
    options: operations['Accounts_findAllByUser']['parameters']['query'] = {},
  ): Promise<SchemaAccountDto[]> {
    const { data, error } = await this.client.GET('/api/accounts', {
      params: {
        query: options,
      },
      next: {
        tags: [
          this.API_TAG.ACCOUNT,
          this.API_TAG.TRANSACTION,
          this.API_TAG.INCOME,
          this.API_TAG.EXPENSE,
          this.API_TAG.TRANSFER,
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch accounts', error);
    }

    return data as SchemaAccountDto[];
  }

  public static async getById(id: string): Promise<SchemaAccountDto | null> {
    const { data } = await this.client.GET(`/api/accounts/{id}`, {
      params: {
        path: { id },
      },
      next: {
        tags: [
          this.API_TAG.ACCOUNT,
          this.API_TAG.TRANSACTION,
          this.API_TAG.INCOME,
          this.API_TAG.EXPENSE,
          this.API_TAG.TRANSFER,
          this.getEntityTag(this.API_TAG.ACCOUNT, id),
        ],
      },
    });

    return data ?? null;
  }

  public static async getTotalBalance(
    dashboardSettings: operations['Accounts_findAllByUser']['parameters']['query'] = {
      accountTypes: undefined,
    },
  ): Promise<number> {
    const accounts = await this.getAll({
      accountTypes: dashboardSettings.accountTypes,
    });

    return (
      accounts.reduce(
        (acc, { balance, currentDateBalance }) =>
          acc + (currentDateBalance ?? balance ?? 0),
        0,
      ) ?? NaN
    );
  }

  public static async getAccountBalanceHistory(
    id: string,
  ): Promise<SchemaAccountBalanceHistoryDto[]> {
    const { data } = await this.client.GET(
      `/api/accounts/{id}/balance-history`,
      {
        params: {
          path: { id },
        },
        next: {
          tags: [
            this.API_TAG.ACCOUNT,
            this.API_TAG.TRANSACTION,
            this.API_TAG.INCOME,
            this.API_TAG.EXPENSE,
            this.API_TAG.TRANSFER,
            this.getEntityTag(this.API_TAG.ACCOUNT, id),
          ],
        },
      },
    );

    return data as SchemaAccountBalanceHistoryDto[];
  }

  public static async add(newAccount: SchemaCreateAccountDto): Promise<void> {
    const { error } = await this.client.POST('/api/accounts', {
      body: newAccount,
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
    updatedAccount: SchemaUpdateAccountDto,
  ): Promise<void> {
    const { error } = await this.client.PATCH(`/api/accounts/{id}`, {
      params: {
        path: { id },
      },
      body: updatedAccount,
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

    this.revalidateCache(id);
    this.revalidateCache();
  }

  public static async delete(id: string): Promise<void> {
    const { error } = await this.client.DELETE(`/api/accounts/{id}`, {
      params: {
        path: { id },
      },
    });

    if (error) {
      throw new Error('Failed to delete account', error);
    }

    this.revalidateCache();
  }
}
