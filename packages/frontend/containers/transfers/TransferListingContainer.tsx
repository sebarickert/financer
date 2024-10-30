import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListWithMonthlyPager } from '$blocks/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { Layout } from '$layouts/Layout';

export const TransferListingContainer: FC = () => {
  return (
    <Layout title="Transfers" backLink="/statistics">
      <TransactionListWithMonthlyPager type={TransactionType.Transfer} />
    </Layout>
  );
};
