import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Layout } from '$layouts/Layout';
import { TransactionListWithMonthlyPager } from '$modules/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';

export const TransferListingContainer: FC = () => {
  return (
    <Layout title="Transfers" backLink="/statistics">
      <TransactionListWithMonthlyPager type={TransactionType.Transfer} />
    </Layout>
  );
};
