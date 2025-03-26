import { Metadata } from 'next';

import { getExpenseById } from '@/api-service';
import { ExpenseContainer } from '@/container/expenses/ExpenseContainer';
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
    title: `${expense.description} / Expenses`,
  };
};

const ExpensePage = async ({ params }: { params: Params }) => {
  const { expenseId } = await params;

  return <ExpenseContainer id={expenseId} />;
};

export default ExpensePage;
