'use server';

import { RedirectType, redirect } from 'next/navigation';

import { deleteAccount } from '@/api-service';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';

export const handleAccountDelete: DefaultFormActionHandler<{
  id: string;
}> = async ({ id }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete account: no id'] };
  }

  await deleteAccount(id);

  redirect('/accounts', RedirectType.push);
};
