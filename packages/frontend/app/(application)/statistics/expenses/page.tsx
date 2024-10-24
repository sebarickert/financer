import { Metadata } from 'next';
import { FC } from 'react';

import { ExpenseListingContainer } from '$container/expenses/expense.listing.container';
import { Layout } from '$layouts/Layout';

export const metadata: Metadata = {
  title: 'Expenses',
};

const ExpensesPage: FC = () => {
  return (
    <Layout title="Expenses">
      <ExpenseListingContainer />
    </Layout>
  );
};

export default ExpensesPage;
