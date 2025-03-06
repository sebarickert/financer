import { Metadata } from 'next';

import { EditExpenseContainer } from '@/container/expenses/ExpenseEditContainer';
import { ExpenseService } from '@/ssr/api/ExpenseService';

type Params = Promise<{
  expenseId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { expenseId } = await params;
  const expense = await ExpenseService.getById(expenseId);

  return {
    title: `Edit ${expense.description} / Expenses`,
  };
};

const EditExpensePage = async ({ params }: { params: Params }) => {
  const { expenseId } = await params;

  return <EditExpenseContainer id={expenseId} />;
};

export default EditExpensePage;
