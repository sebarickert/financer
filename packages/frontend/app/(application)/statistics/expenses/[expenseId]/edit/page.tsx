import { Metadata } from 'next';
import { FC } from 'react';

import { EditExpenseContainer } from '$container/expenses/ExpenseEditContainer';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Edit Expense',
};

type EditExpensePageProps = {
  params: {
    expenseId: string;
  };
};

const EditExpensePage: FC<EditExpensePageProps> = ({
  params: { expenseId },
}) => {
  return <EditExpenseContainer id={expenseId} />;
};

export default EditExpensePage;
