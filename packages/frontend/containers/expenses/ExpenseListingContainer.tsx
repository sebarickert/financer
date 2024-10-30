import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListWithMonthlyPager } from '$blocks/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { Layout } from '$layouts/Layout';

export const ExpenseListingContainer: FC = () => {
  return (
    <Layout title="Expenses" backLink="/statistics">
      <TransactionListWithMonthlyPager type={TransactionType.Expense} />
    </Layout>
  );
};
