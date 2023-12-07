import { useAccountsRemoveMutation } from '$api/generated/financerApi';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { AccountDelete } from '$pages/accounts/account.delete';

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
    push('/accounts');
  };

  return <AccountDelete onDelete={handleDelete} />;
};
