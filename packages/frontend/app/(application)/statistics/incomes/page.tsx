import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeListingContainer } from '$container/incomes/income.listing.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Incomes',
};

type IncomesPageProps = {
  searchParams: {
    date?: string;
    page?: string;
  };
};

const IncomesPage: FC<IncomesPageProps> = ({
  searchParams: { date, page },
}) => {
  return (
    <Layout title="Incomes">
      <IncomeListingContainer
        date={date as string}
        page={parseInt(page as string)}
      />
    </Layout>
  );
};

export default IncomesPage;
