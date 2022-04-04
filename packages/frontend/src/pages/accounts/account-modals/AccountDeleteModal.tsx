import { useState } from 'react';

import { LinkListButton } from '../../../components/link-list/link-list.button';
import { ModalConfirmActions } from '../../../components/modal/confirm/modal.confirm.actions';
import { ModalConfirmHeader } from '../../../components/modal/confirm/modal.confirm.header';

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
      <LinkListButton icon="trash" handleClick={handleToggleOpen}>
        Delete account
      </LinkListButton>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </div>
          <div
            className={`flex items-end justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0 pb-[calc(78px+env(safe-area-inset-bottom))]`}
          >
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
            &#8203;
            <div
              className="inline-block w-full max-w-lg overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <ModalConfirmHeader label="Delete account">
                Are you sure you want to delete your account? All of your data
                will be permanently removed. This action cannot be undone.
              </ModalConfirmHeader>
              <ModalConfirmActions
                submitButtonLabel="Delete"
                onCancel={handleToggleOpen}
                onConfirm={handleDelete}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
