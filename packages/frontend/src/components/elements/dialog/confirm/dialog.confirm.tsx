import { Button } from '../../Button/Button';
import { ButtonGroup } from '../../Button/ButtonGroup';
import { DialogText } from '../dialog.text';

import { IconName } from '$elements/Icon';

interface DialogConfirmProps {
  children?: string;
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
  submitButtonLabel: string;
  testId?: string;
  iconName?: IconName;
}

export const DialogConfirm = ({
  children,
  label,
  onConfirm,
  onCancel,
  submitButtonLabel,
  testId = '',
  iconName,
}: DialogConfirmProps) => {
  return (
    <section>
      <DialogText label={label} iconName={iconName} className="mb-8">
        {children}
      </DialogText>
      <ButtonGroup>
        <Button onClick={onConfirm} testId={`${testId}_confirm-button`}>
          {submitButtonLabel}
        </Button>
        <Button
          onClick={onCancel}
          accentColor="secondary"
          testId={`${testId}_cancel-button`}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </section>
  );
};
