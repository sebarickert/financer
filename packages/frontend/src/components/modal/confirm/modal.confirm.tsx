import { useState } from 'react';

import { ButtonAccentColor } from '../../button/button';
import { Modal } from '../modal';

import { ModalConfirmActions } from './modal.confirm.actions';
import { ModalConfirmHeader } from './modal.confirm.header';

interface IModalConfirmProps {
  accentColor?: ButtonAccentColor;
  children?: string;
  label: string;
  modalOpenButtonLabel: string;
  onConfirm(): void;
  submitButtonLabel: string;
  testId?: string;
}

export const ModalConfirm = ({
  children,
  label,
  modalOpenButtonLabel,
  onConfirm,
  submitButtonLabel,
  accentColor,
  testId = '',
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
      testId={testId}
    >
      <ModalConfirmHeader label={label}>{children}</ModalConfirmHeader>
      <ModalConfirmActions
        submitButtonLabel={submitButtonLabel}
        onCancel={handleToggleOpen}
        onConfirm={handleConfirm}
        testId={testId}
      />
    </Modal>
  );
};
