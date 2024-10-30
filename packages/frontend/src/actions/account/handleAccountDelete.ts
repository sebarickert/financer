'use server';

import { redirect, RedirectType } from 'next/navigation';

import { AccountService } from '$ssr/api/account.service';

export const handleAccountDelete = async (id: string) => {
  if (!id) {
    console.error('Failure to delete account: no id');
    return;
  }

  await AccountService.delete(id);
  redirect('/accounts', RedirectType.push);
};
