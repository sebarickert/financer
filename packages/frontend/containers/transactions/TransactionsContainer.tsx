import { FC } from 'react';

import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { TransactionsLayout } from '$features/transactions/TransactionsLayout';

export const TransactionsContainer: FC = () => {
  return (
    <TransactionsLayout title="Transactions">
      <TransactionListWithMonthlyPager isSummaryVisible />
    </TransactionsLayout>
  );
};
