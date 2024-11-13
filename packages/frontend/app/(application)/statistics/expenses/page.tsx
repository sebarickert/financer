import { Metadata } from 'next';
import { FC } from 'react';

import { ExpenseListingContainer } from '$container/expenses/ExpenseListingContainer';

export const metadata: Metadata = {
  title: 'Expenses / Statistics',
};

const ExpensesPage: FC = () => {
  return <ExpenseListingContainer />;
};

export default ExpensesPage;
