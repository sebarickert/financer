import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { TransactionsLayout } from '$features/transactions/TransactionsLayout';

export const ExpenseListingContainer: FC = () => {
  return (
    <TransactionsLayout title="Expenses">
      <TransactionListWithMonthlyPager type={TransactionType.Expense} />
    </TransactionsLayout>
  );
};
