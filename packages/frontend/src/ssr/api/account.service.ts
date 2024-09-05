import { BaseApi } from './base-api';

import {
  AccountDto,
  AccountsFindAllByUserApiArg,
  PaginationDto,
} from '$api/generated/financerApi';

export class AccountService extends BaseApi {
  public static async getAccounts(
    params: AccountsFindAllByUserApiArg,
  ): Promise<(PaginationDto & { data: AccountDto[] }) | null> {
    const { data } = await this.client.GET('/api/accounts', {
      params: {
        query: params,
      },
    });

    return (data as PaginationDto & { data: AccountDto[] }) ?? null;
  }

  public static async getTotalBalance(
    dashboardSettings: Pick<AccountsFindAllByUserApiArg, 'accountTypes'> = {
      accountTypes: undefined,
    },
  ): Promise<number> {
    const accounts = await this.getAccounts({
      accountTypes: dashboardSettings.accountTypes,
    });

    return (
      accounts?.data.reduce((acc, { balance }) => acc + (balance ?? 0), 0) ??
      NaN
    );
  }
}
