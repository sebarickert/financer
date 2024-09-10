import { FC } from 'react';

import { Transaction } from '$blocks/transaction/transaction';
import { AccountService } from '$ssr/api/account.service';
import { TransactionService } from '$ssr/api/transaction.service';

interface ExpenseContainerProps {
  id: string;
}

export const ExpenseContainer: FC<ExpenseContainerProps> = async ({ id }) => {
  const expense = await TransactionService.getExpenseById(id);

  const account = await AccountService.getById(expense.fromAccount);

  return <Transaction transaction={expense} fromAccount={account?.name} />;
};
