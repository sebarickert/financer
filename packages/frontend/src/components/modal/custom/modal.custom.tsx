import React, { useState } from 'react';

import { AccentColor } from '../../button/button';
import { Modal } from '../modal';

import { ModalCustomActions } from './modal.custom.actions';
import { ModalCustomContent } from './modal.custom.content';

interface IModalCustomProps {
  accentColor?: 'red' | 'green' | 'blue';
  children: React.ReactNode;
  modalOpenButtonLabel: string;
  onConfirm(): void;
  submitButtonLabel: string;
  submitButtonAccentColor?: AccentColor;
  buttonStyle?: 'quick-link' | 'default';
}

export const ModalCustom = ({
  children,
  modalOpenButtonLabel,
  onConfirm,
  submitButtonLabel,
  submitButtonAccentColor = 'blue',
  accentColor,
  buttonStyle = 'default',
}: IModalCustomProps): JSX.Element => {
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
      buttonStyle={buttonStyle}
    >
      <ModalCustomContent>{children}</ModalCustomContent>
      <ModalCustomActions
        submitButtonLabel={submitButtonLabel}
        onCancel={handleToggleOpen}
        onConfirm={handleConfirm}
        submitButtonAccentColor={submitButtonAccentColor}
      />
    </Modal>
  );
};
