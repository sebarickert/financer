'use client';

import { useAccountsRemoveMutation } from '$api/generated/financerApi';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { clearAccountCache } from '$ssr/api/clear-cache';
import { AccountDelete } from '$views/accounts/account.delete';

interface DeleteAccountContainerProps {
  id: string;
}

export const DeleteAccountContainer = ({ id }: DeleteAccountContainerProps) => {
  const { push } = useViewTransitionRouter();

  const [deleteAccount] = useAccountsRemoveMutation();

  const handleDelete = async () => {
    if (!id) {
      console.error('Failure to delete account: no id');
      return;
    }
    await deleteAccount({ id }).unwrap();
    await clearAccountCache();
    push('/accounts');
  };

  return <AccountDelete onDelete={handleDelete} />;
};
