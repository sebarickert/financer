'use server';

import { RedirectType, redirect } from 'next/navigation';

import { TransactionType } from '@/api/ssr-financer-api';
import { deleteExpense, deleteIncome, deleteTransfer } from '@/api-service';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
export const handleTransactionDelete: DefaultFormActionHandler<{
  id: string;
  type: TransactionType;
}> = async ({ id, type }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete transaction: no id'] };
  }

  const deleteMapping = {
    [TransactionType.INCOME]: deleteIncome,
    [TransactionType.EXPENSE]: deleteExpense,
    [TransactionType.TRANSFER]: deleteTransfer,
  };

  await deleteMapping[type](id);

  redirect('/transactions', RedirectType.push);
};
