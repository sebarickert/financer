import { useRouter } from 'next/router';

import { EditExpenseContainer } from '$container/expenses/edit-expense.container';

const EditExpensePage = () => {
  const {
    query: { expenseId },
  } = useRouter();

  return <EditExpenseContainer id={expenseId as string} />;
};

export default EditExpensePage;
