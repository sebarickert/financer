import { HeaderDrawerAction } from '$blocks/header-drawer-action/header-drawer-action';

interface AccountDeleteProps {
  onDelete: () => void;
}

export const AccountDelete = ({ onDelete }: AccountDeleteProps) => {
  return (
    <HeaderDrawerAction
      onSubmit={onDelete}
      buttonIcon={'TrashIcon'}
      buttonLabel="Delete account"
      buttonTestId="delete-account"
      drawerButtonAccentColor="danger"
      drawerButtonLabel="Delete"
      drawerHeading="Delete account"
      drawerDescription="Are you sure you want to permanently delete this account?"
    />
  );
};
