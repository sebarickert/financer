import { FC } from 'react';

import { EditExpenseContainer } from '$container/expenses/expense.edit.container';

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
