import { FC } from 'react';

import { Transaction } from '$blocks/Transaction';
import { AccountService } from '$ssr/api/account.service';
import { ExpenseService } from '$ssr/api/expense.service ';

interface ExpenseContainerProps {
  id: string;
}

export const ExpenseContainer: FC<ExpenseContainerProps> = async ({ id }) => {
  const expense = await ExpenseService.getById(id);

  const account = await AccountService.getById(expense.fromAccount);

  return <Transaction transaction={expense} fromAccount={account?.name} />;
};
