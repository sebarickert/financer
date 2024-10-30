import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeListingContainer } from '$container/incomes/IncomeListingContainer';

export const metadata: Metadata = {
  title: 'Incomes',
};

const IncomesPage: FC = () => {
  return <IncomeListingContainer />;
};

export default IncomesPage;
