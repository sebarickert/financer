import { Metadata } from 'next';

import { getExpenseById } from '@/api-service';
import { EditExpenseContainer } from '@/container/expenses/ExpenseEditContainer';
type Params = Promise<{
  expenseId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { expenseId } = await params;
  const expense = await getExpenseById(expenseId);

  return {
    title: `Edit ${expense.description} / Expenses`,
  };
};

const EditExpensePage = async ({ params }: { params: Params }) => {
  const { expenseId } = await params;

  return <EditExpenseContainer id={expenseId} />;
};

export default EditExpensePage;
