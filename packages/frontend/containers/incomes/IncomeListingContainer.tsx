import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Layout } from '$layouts/Layout';
import { TransactionListWithMonthlyPager } from '$modules/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';

export const IncomeListingContainer: FC = () => {
  return (
    <Layout title="Incomes" backLink="/statistics">
      <TransactionListWithMonthlyPager type={TransactionType.Income} />
    </Layout>
  );
};
