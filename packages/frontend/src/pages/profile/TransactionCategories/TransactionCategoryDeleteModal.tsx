import { useState } from 'react';

import { DialogConfirm } from '../../../components/elements/dialog/confirm/dialog.confirm';
import { Dialog } from '../../../components/elements/dialog/dialog';
import { IconName } from '../../../components/elements/icon/icon';
import { LinkListButton } from '../../../components/elements/link-list/link-list.button';

interface TransactionCategoryDeleteModalProps {
  handleDelete(): void;
}

export const TransactionCategoryDeleteModal = ({
  handleDelete,
}: TransactionCategoryDeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <LinkListButton
        icon={IconName.trash}
        handleClick={handleToggleOpen}
        testId="delete-transaction-category"
      >
        Delete transaction category
      </LinkListButton>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogConfirm
          onConfirm={handleDelete}
          onCancel={handleToggleOpen}
          label="Delete transaction category"
          submitButtonLabel="Delete"
          iconName={IconName.exclamation}
          testId="delete-transaction-category"
        >
          Are you sure you want to delete this transaction category? All of your
          data will be permanently removed. This action cannot be undone.
        </DialogConfirm>
      </Dialog>
    </>
  );
};
