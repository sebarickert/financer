import React, { useState } from 'react';

import { Modal } from '../modal';

import { ModalConfirmActions } from './modal.confirm.actions';
import { ModalConfirmHeader } from './modal.confirm.header';

interface IModalConfirmProps {
  accentColor?: 'red' | 'green' | 'blue';
  children?: string;
  label: string;
  modalOpenButtonLabel: string;
  onConfirm(): void;
  submitButtonLabel: string;
}

export const ModalConfirm = ({
  children,
  label,
  modalOpenButtonLabel,
  onConfirm,
  submitButtonLabel,
  accentColor,
}: IModalConfirmProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen(!isOpen);
  const handleConfirm = () => {
    onConfirm();
    handleToggleOpen();
  };
  return (
    <Modal
      modalOpenButtonLabel={modalOpenButtonLabel}
      toggleOpen={handleToggleOpen}
      isOpen={isOpen}
      accentColor={accentColor}
    >
      <ModalConfirmHeader label={label}>{children}</ModalConfirmHeader>
      <ModalConfirmActions
        submitButtonLabel={submitButtonLabel}
        onCancel={handleToggleOpen}
        onConfirm={handleConfirm}
      />
    </Modal>
  );
};
