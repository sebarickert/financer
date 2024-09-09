import { revalidateTag } from 'next/cache';

import { BaseApi } from './base-api';

import {
  AccountDto,
  AccountsFindAllByUserApiArg,
  PaginationDto,
} from '$api/generated/financerApi';

export class AccountService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static async clearCache(): Promise<void> {
    revalidateTag(this.API_TAG.ACCOUNT);
  }

  public static async getAll(
    params: AccountsFindAllByUserApiArg,
  ): Promise<(PaginationDto & { data: AccountDto[] }) | null> {
    const { data } = await this.client.GET('/api/accounts', {
      params: {
        query: params,
      },
      next: {
        tags: [this.API_TAG.ACCOUNT, this.getListTag(this.API_TAG.ACCOUNT)],
      },
    });

    return (data as PaginationDto & { data: AccountDto[] }) ?? null;
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
}
