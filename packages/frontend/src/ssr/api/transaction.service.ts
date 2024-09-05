import { BaseApi } from './base-api';

import { TransactionsFindMonthlySummariesByUserApiArg } from '$api/generated/financerApi';

export class TransactionService extends BaseApi {
  public static async getMonthlySummary(
    params: TransactionsFindMonthlySummariesByUserApiArg,
  ) {
    const { data } = await this.client.GET(
      '/api/transactions/monthly-summaries',
      {
        params: {
          query: params,
        },
      },
    );

    return data;
  }
}
