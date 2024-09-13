import { revalidateTag } from 'next/cache';

import { BaseApi } from './base-api';

import {
  AccountDto,
  AccountsFindAllByUserApiArg,
  CreateAccountDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { isValidationErrorResponse } from '$utils/apiHelper';
import { GenericPaginationDto } from 'src/types/pagination.dto';

export class AccountService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static async clearCache(): Promise<void> {
    revalidateTag(this.API_TAG.ACCOUNT);
  }

  public static async getAll(
    params: AccountsFindAllByUserApiArg = {},
  ): Promise<GenericPaginationDto<AccountDto>> {
    const { data, error } = await this.client.GET('/api/accounts', {
      params: {
        query: params,
      },
      next: {
        tags: [this.API_TAG.ACCOUNT, this.getListTag(this.API_TAG.ACCOUNT)],
      },
    });

    if (error) {
      throw new Error('Failed to fetch accounts', error);
    }

    return data as GenericPaginationDto<AccountDto>;
  }

  public static async getById(id: string): Promise<AccountDto | null> {
    const { data } = await this.client.GET(`/api/accounts/{id}`, {
      params: {
        path: { id },
      },
      next: {
        tags: [
          this.API_TAG.ACCOUNT,
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
      accounts?.data.reduce((acc, { balance }) => acc + (balance ?? 0), 0) ??
      NaN
    );
  }

  public static async add(newAccount: CreateAccountDto): Promise<void> {
    const { error } = await this.client.POST('/api/accounts', {
      body: newAccount,
      next: {
        revalidate: 0,
      },
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

    await this.clearCache();
  }

  public static async update(
    id: string,
    updatedAccount: CreateAccountDto,
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

    await this.clearCache();
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

    await this.clearCache();
  }
}
