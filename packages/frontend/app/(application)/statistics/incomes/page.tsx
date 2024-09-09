import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeListingContainer } from '$container/incomes/income.listing.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Incomes',
};

const IncomesPage: FC = () => {
  return (
    <Layout title="Incomes">
      <IncomeListingContainer />
    </Layout>
  );
};

export default IncomesPage;
