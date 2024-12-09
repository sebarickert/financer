import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';

import {
  AccountBalanceHistoryDto,
  AccountDto,
  AccountsFindAllByUserApiArg,
  CreateAccountDto,
  UpdateAccountDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { isValidationErrorResponse } from '$utils/apiHelper';

export class AccountService extends BaseApi {
  public static async revalidateCache(id?: string): Promise<void> {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.ACCOUNT, id));
      return;
    }

    revalidateTag(this.API_TAG.ACCOUNT);
  }

  public static async getAll(
    params: AccountsFindAllByUserApiArg = {},
  ): Promise<AccountDto[]> {
    const { data, error } = await this.client.GET('/api/accounts', {
      params: {
        query: params,
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

    return data as AccountDto[];
  }

  public static async getById(id: string): Promise<AccountDto | null> {
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

    return data as AccountDto;
  }

  public static async getTotalBalance(
    dashboardSettings: Pick<AccountsFindAllByUserApiArg, 'accountTypes'> = {
      accountTypes: undefined,
    },
  ): Promise<number> {
    const accounts = await this.getAll({
      accountTypes: dashboardSettings.accountTypes,
    });

    return (
      accounts?.reduce(
        (acc, { balance, currentDateBalance }) =>
          acc + (currentDateBalance ?? balance ?? 0),
        0,
      ) ?? NaN
    );
  }

  public static async getAccountBalanceHistory(
    id: string,
  ): Promise<AccountBalanceHistoryDto[]> {
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

    return data as AccountBalanceHistoryDto[];
  }

  public static async add(newAccount: CreateAccountDto): Promise<void> {
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

    await this.revalidateCache();
  }

  public static async update(
    id: string,
    updatedAccount: UpdateAccountDto,
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

    await this.revalidateCache(id);
    await this.revalidateCache();
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

    await this.revalidateCache();
  }
}
