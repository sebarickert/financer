import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { Layout } from '$layouts/Layout';

export const IncomeListingContainer: FC = () => {
  return (
    <Layout title="Incomes" backLink="/statistics">
      <TransactionListWithMonthlyPager type={TransactionType.Income} />
    </Layout>
  );
};
