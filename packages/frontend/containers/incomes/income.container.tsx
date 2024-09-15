import { FC } from 'react';

import { Transaction } from '$blocks/transaction/transaction';
import { AccountService } from '$ssr/api/account.service';
import { IncomeService } from '$ssr/api/income.service';

interface IncomeContainerProps {
  id: string;
}

export const IncomeContainer: FC<IncomeContainerProps> = async ({ id }) => {
  const income = await IncomeService.getById(id);

  const account = await AccountService.getById(income.toAccount);

  return <Transaction transaction={income} toAccount={account?.name} />;
};
