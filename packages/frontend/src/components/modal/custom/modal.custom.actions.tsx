import React from 'react';

import { ButtonAccentColor, Button } from '../../button/button';
import { ButtonGroup } from '../../button/button.group';

interface IModalCustomActionsProps {
  onCancel(): void;
  onConfirm(): void;
  submitButtonLabel: string;
  submitButtonAccentColor: ButtonAccentColor;
}

export const ModalCustomActions = ({
  onCancel,
  onConfirm,
  submitButtonLabel,
  submitButtonAccentColor,
}: IModalCustomActionsProps): JSX.Element => {
  return (
    <ButtonGroup className="bg-gray-50 px-4 py-3 sm:px-6" isReverse>
      <Button onClick={onConfirm} accentColor={submitButtonAccentColor}>
        {submitButtonLabel}
      </Button>
      <Button onClick={onCancel} accentColor="plain">
        Cancel
      </Button>
    </ButtonGroup>
  );
};
