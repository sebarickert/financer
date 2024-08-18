import { FC } from 'react';

import { ExpenseContainer } from '$container/expenses/expense.container';

type ExpensePageProps = {
  params: {
    expenseId: string;
  };
};

const ExpensePage: FC<ExpensePageProps> = ({ params: { expenseId } }) => {
  return <ExpenseContainer id={expenseId} />;
};

export default ExpensePage;
