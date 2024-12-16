'use server';

import { redirect, RedirectType } from 'next/navigation';

import { TransactionType } from '$api/generated/financerApi';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { ExpenseService } from '$ssr/api/ExpenseService';
import { IncomeService } from '$ssr/api/IncomeService';
import { TransferService } from '$ssr/api/TransferService';

export const handleTransactionDelete: DefaultFormActionHandler<{
  id: string;
  type: TransactionType;
}> = async ({ id, type }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete transaction: no id'] };
  }

  const serviceMapping = {
    [TransactionType.Income]: IncomeService,
    [TransactionType.Expense]: ExpenseService,
    [TransactionType.Transfer]: TransferService,
  };

  await serviceMapping[type].delete(id);

  redirect('/transactions', RedirectType.push);
};
