'use server';

import { redirect, RedirectType } from 'next/navigation';

import { TransactionType } from '$api/generated/financerApi';
import { ExpenseService } from '$ssr/api/expense.service ';
import { IncomeService } from '$ssr/api/income.service';
import { TransferService } from '$ssr/api/transfer.service';

export const handleTransactionDelete = async (
  id: string,
  type: TransactionType,
) => {
  if (!id) {
    console.error('Failed to delete transaction: no id');
    return;
  }

  const serviceMapping = {
    [TransactionType.Income]: IncomeService,
    [TransactionType.Expense]: ExpenseService,
    [TransactionType.Transfer]: TransferService,
  };

  await serviceMapping[type].delete(id);

  redirect('/statistics', RedirectType.push);
};
