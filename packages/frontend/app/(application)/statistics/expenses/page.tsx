import { Metadata } from 'next';
import { FC } from 'react';

import { ExpenseListingContainer } from '$container/expenses/expense.listing.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Expenses',
};

type ExpensesPageProps = {
  searchParams: {
    date?: string;
    page?: string;
  };
};

const ExpensesPage: FC<ExpensesPageProps> = ({
  searchParams: { date, page },
}) => {
  return (
    <Layout title="Expenses">
      <ExpenseListingContainer
        date={date as string}
        page={parseInt(page as string)}
      />
    </Layout>
  );
};

export default ExpensesPage;
