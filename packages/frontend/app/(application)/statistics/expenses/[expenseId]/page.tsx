import { Metadata } from 'next';
import { FC } from 'react';

import { ExpenseContainer } from '$container/expenses/expense.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Expense Details',
};

type ExpensePageProps = {
  params: {
    expenseId: string;
  };
};

const ExpensePage: FC<ExpensePageProps> = ({ params: { expenseId } }) => {
  return (
    <Layout title="Expense Details">
      <ExpenseContainer id={expenseId} />
    </Layout>
  );
};

export default ExpensePage;
