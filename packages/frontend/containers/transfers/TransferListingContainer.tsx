import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { TransactionsLayout } from '$features/transactions/TransactionsLayout';

export const TransferListingContainer: FC = () => {
  return (
    <TransactionsLayout title="Transfers">
      <TransactionListWithMonthlyPager type={TransactionType.Transfer} />
    </TransactionsLayout>
  );
};
