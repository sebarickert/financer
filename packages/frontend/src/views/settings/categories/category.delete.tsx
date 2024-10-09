import { HeaderDrawerAction } from '$blocks/header-drawer-action/header-drawer-action';

interface CategoryDeleteProps {
  onDelete: () => void;
}

export const CategoryDelete = ({ onDelete }: CategoryDeleteProps) => {
  return (
    <HeaderDrawerAction
      onSubmit={onDelete}
      buttonIcon={'TrashIcon'}
      buttonLabel="Delete category"
      buttonTestId="delete-category"
      drawerButtonAccentColor="red"
      drawerButtonLabel="Delete"
      drawerHeading="Delete category"
      drawerDescription="Are you sure you want to permanently delete this category?"
    />
  );
};
