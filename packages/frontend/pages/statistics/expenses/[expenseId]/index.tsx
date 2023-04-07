import { useRouter } from 'next/router';

import { ExpenseContainer } from '$container/expenses/expense.container';

const ExpensePage = () => {
  const {
    query: { expenseId },
  } = useRouter();

  return <ExpenseContainer id={expenseId as string} />;
};

export default ExpensePage;
