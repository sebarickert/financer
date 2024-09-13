import { redirect, RedirectType } from 'next/navigation';

import { AccountService } from '$ssr/api/account.service';
import { AccountDelete } from '$views/accounts/account.delete';

interface DeleteAccountContainerProps {
  id: string;
}

export const DeleteAccountContainer = ({ id }: DeleteAccountContainerProps) => {
  const handleDelete = async () => {
    'use server';

    if (!id) {
      console.error('Failure to delete account: no id');
      return;
    }
    await AccountService.delete(id);
    redirect('/accounts', RedirectType.push);
  };

  return <AccountDelete onDelete={handleDelete} />;
};
