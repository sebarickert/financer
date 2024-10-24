import { HeaderDrawerAction } from '$blocks/header-drawer-action/header-drawer-action';

interface TransactionDeleteProps {
  onDelete: () => void;
}

export const TransactionDelete = ({ onDelete }: TransactionDeleteProps) => {
  return (
    <HeaderDrawerAction
      onSubmit={onDelete}
      buttonIcon={'TrashIcon'}
      buttonLabel="Delete transaction"
      buttonTestId="delete-transaction"
      drawerButtonAccentColor="danger"
      drawerButtonLabel="Delete"
      drawerHeading="Delete transaction"
      drawerDescription="Are you sure you want to permanently delete this transaction?"
    />
  );
};
