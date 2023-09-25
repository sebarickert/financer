import { EditExpenseContainer } from '$container/expenses/edit-expense.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditExpensePage = () => {
  const {
    query: { expenseId },
  } = useViewTransitionRouter();

  return <EditExpenseContainer id={expenseId as string} />;
};

export default EditExpensePage;
