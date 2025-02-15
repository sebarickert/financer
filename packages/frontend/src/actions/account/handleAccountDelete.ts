'use server';

import { RedirectType, redirect } from 'next/navigation';

import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { AccountService } from '$ssr/api/AccountService';

export const handleAccountDelete: DefaultFormActionHandler<{
  id: string;
}> = async ({ id }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete account: no id'] };
  }

  await AccountService.delete(id);

  redirect('/accounts', RedirectType.push);
};
