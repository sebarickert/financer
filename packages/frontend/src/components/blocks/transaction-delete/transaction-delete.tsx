import { HeaderDrawerAction } from '$blocks/header-drawer-action/header-drawer-action';
import { IconName } from '$elements/icon/icon';

interface TransactionDeleteProps {
  onDelete: () => void;
}

export const TransactionDelete = ({ onDelete }: TransactionDeleteProps) => {
  return (
    <HeaderDrawerAction
      onSubmit={onDelete}
      buttonIcon={IconName.trash}
      buttonLabel="Delete transaction"
      buttonTestId="delete-transaction"
      drawerButtonAccentColor="red"
      drawerButtonLabel="Delete"
      drawerHeading="Delete transaction"
      drawerDescription="Are you sure you want to permanently delete this transaction?"
    />
  );
};
