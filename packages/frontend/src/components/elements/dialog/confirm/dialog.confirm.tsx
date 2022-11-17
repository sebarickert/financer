import { Button } from '../../button/button';
import { ButtonGroup } from '../../button/button.group';
import { IconName } from '../../icon/icon';
import { DialogText } from '../dialog.text';

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
      <ButtonGroup isReverse>
        <Button onClick={onConfirm} testId={`${testId}_confirm-button`}>
          {submitButtonLabel}
        </Button>
        <Button
          onClick={onCancel}
          accentColor="plain"
          testId={`${testId}_cancel-button`}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </section>
  );
};
