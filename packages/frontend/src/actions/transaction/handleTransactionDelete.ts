'use server';

import { RedirectType, redirect } from 'next/navigation';

import { TransactionType } from '@/api/ssr-financer-api';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
import { ExpenseService } from '@/ssr/api/ExpenseService';
import { IncomeService } from '@/ssr/api/IncomeService';
import { TransferService } from '@/ssr/api/TransferService';

export const handleTransactionDelete: DefaultFormActionHandler<{
  id: string;
  type: TransactionType;
}> = async ({ id, type }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete transaction: no id'] };
  }

  const serviceMapping = {
    [TransactionType.INCOME]: IncomeService,
    [TransactionType.EXPENSE]: ExpenseService,
    [TransactionType.TRANSFER]: TransferService,
  };

  await serviceMapping[type].delete(id);

  redirect('/transactions', RedirectType.push);
};
