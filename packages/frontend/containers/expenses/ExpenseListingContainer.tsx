import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Layout } from '$layouts/Layout';
import { TransactionListWithMonthlyPager } from '$modules/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';

export const ExpenseListingContainer: FC = () => {
  return (
    <Layout title="Expenses" backLink="/statistics">
      <TransactionListWithMonthlyPager type={TransactionType.Expense} />
    </Layout>
  );
};
