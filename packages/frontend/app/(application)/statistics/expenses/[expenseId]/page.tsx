import { Metadata } from 'next';
import { FC } from 'react';

import { ExpenseContainer } from '$container/expenses/ExpenseContainer';

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
  return <ExpenseContainer id={expenseId} />;
};

export default ExpensePage;
