import { EditExpenseContainer } from '$container/expenses/expense.edit.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditExpensePage = () => {
  const {
    query: { expenseId },
  } = useViewTransitionRouter();

  return <EditExpenseContainer id={expenseId as string} />;
};

export default EditExpensePage;
