import { Metadata } from 'next';
import { FC } from 'react';

import { EditExpenseContainer } from '$container/expenses/ExpenseEditContainer';
import { ExpenseService } from '$ssr/api/ExpenseService';

type EditExpensePageProps = {
  params: {
    expenseId: string;
  };
};

export const generateMetadata = async ({
  params: { expenseId },
}: EditExpensePageProps): Promise<Metadata> => {
  const expense = await ExpenseService.getById(expenseId);

  return {
    title: `Edit ${expense.description} / Expenses`,
  };
};

const EditExpensePage: FC<EditExpensePageProps> = ({
  params: { expenseId },
}) => {
  return <EditExpenseContainer id={expenseId} />;
};

export default EditExpensePage;
