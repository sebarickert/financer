import { Metadata } from 'next';
import { FC } from 'react';

import { TransactionsContainer } from '$container/transactions/TransactionsContainer';

export const metadata: Metadata = {
  title: 'Transactions',
};

const TransactionsPage: FC = () => {
  return <TransactionsContainer />;
};

export default TransactionsPage;
