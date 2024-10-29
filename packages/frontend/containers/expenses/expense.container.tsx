import { FC } from 'react';

import { Transaction } from '$blocks/Transaction';
import { ExpenseService } from '$ssr/api/expense.service ';

interface ExpenseContainerProps {
  id: string;
}

export const ExpenseContainer: FC<ExpenseContainerProps> = async ({ id }) => {
  const expense = await ExpenseService.getById(id);

  return <Transaction {...expense} />;
};
