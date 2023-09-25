import { ExpenseContainer } from '$container/expenses/expense.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const ExpensePage = () => {
  const {
    query: { expenseId },
  } = useViewTransitionRouter();

  return <ExpenseContainer id={expenseId as string} />;
};

export default ExpensePage;
