import { Metadata } from 'next';
import { FC } from 'react';

import { ExpenseContainer } from '$container/expenses/ExpenseContainer';
import { ExpenseService } from '$ssr/api/ExpenseService';

type ExpensePageProps = {
  params: {
    expenseId: string;
  };
};

export const generateMetadata = async ({
  params: { expenseId },
}: ExpensePageProps): Promise<Metadata> => {
  const expense = await ExpenseService.getById(expenseId);

  return {
    title: `${expense.description} / Expenses`,
  };
};

const ExpensePage: FC<ExpensePageProps> = ({ params: { expenseId } }) => {
  return <ExpenseContainer id={expenseId} />;
};

export default ExpensePage;
