import { useState } from 'react';

import { DialogConfirm } from '../../../components/elements/dialog/confirm/dialog.confirm';
import { Dialog } from '../../../components/elements/dialog/dialog';
import { IconName } from '../../../components/elements/icon/icon';
import { LinkListButton } from '../../../components/elements/link-list/link-list.button';

interface IAccountDeleteModalProps {
  handleDelete(): void;
}

export const AccountDeleteModal = ({
  handleDelete,
}: IAccountDeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <LinkListButton
        icon={IconName.trash}
        handleClick={handleToggleOpen}
        testId="delete-account"
      >
        Delete account
      </LinkListButton>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogConfirm
          onConfirm={handleDelete}
          onCancel={handleToggleOpen}
          label="Delete account"
          submitButtonLabel="Delete"
          iconName={IconName.exclamation}
          testId="delete-account"
        >
          Are you sure you want to delete your account? All of your data will be
          permanently removed. This action cannot be undone.
        </DialogConfirm>
      </Dialog>
    </>
  );
};
