import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { TransactionsLayout } from '$features/transactions/TransactionsLayout';

export const IncomeListingContainer: FC = () => {
  return (
    <TransactionsLayout title="Incomes">
      <TransactionListWithMonthlyPager type={TransactionType.Income} />
    </TransactionsLayout>
  );
};
