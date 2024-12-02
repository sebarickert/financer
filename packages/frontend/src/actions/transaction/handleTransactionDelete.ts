'use server';

import { redirect, RedirectType } from 'next/navigation';

import { TransactionType } from '$api/generated/financerApi';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { ExpenseService } from '$ssr/api/expense.service ';
import { IncomeService } from '$ssr/api/income.service';
import { TransferService } from '$ssr/api/transfer.service';

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

  redirect('/statistics', RedirectType.push);
};
