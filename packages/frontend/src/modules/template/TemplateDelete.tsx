import { HeaderDrawerAction } from '$blocks/header-drawer-action/header-drawer-action';

type TemplateDeleteProps = {
  onSubmit: () => void;
};

export const TemplateDelete = ({ onSubmit }: TemplateDeleteProps) => {
  return (
    <HeaderDrawerAction
      onSubmit={onSubmit}
      buttonLabel="Delete template"
      buttonIcon={'TrashIcon'}
      drawerButtonAccentColor="danger"
      drawerButtonLabel="Delete"
      drawerHeading="Delete template"
      drawerDescription="Are you sure you want to permanently delete this template?"
    />
  );
};
