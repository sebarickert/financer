import { FC } from 'react';

import { Transaction } from '$blocks/transaction/transaction';
import { AccountService } from '$ssr/api/account.service';
import { TransactionService } from '$ssr/api/transaction.service';

interface IncomeContainerProps {
  id: string;
}

export const IncomeContainer: FC<IncomeContainerProps> = async ({ id }) => {
  const income = await TransactionService.getIncomeById(id);

  const account = await AccountService.getById(income.toAccount);

  return <Transaction transaction={income} toAccount={account?.name} />;
};
