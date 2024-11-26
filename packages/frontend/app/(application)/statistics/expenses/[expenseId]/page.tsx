import { Metadata } from 'next';

import { ExpenseContainer } from '$container/expenses/ExpenseContainer';
import { ExpenseService } from '$ssr/api/expense.service ';

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
    title: `${expense.description} / Expenses`,
  };
};

const ExpensePage = async ({ params }: { params: Params }) => {
  const { expenseId } = await params;

  return <ExpenseContainer id={expenseId} />;
};

export default ExpensePage;
