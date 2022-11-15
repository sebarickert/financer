import { Button } from '../../button/button';
import { ButtonGroup } from '../../button/button.group';

interface DialogConfirmCustomProps {
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  submitButtonLabel: string;
  testId?: string;
}

export const DialogConfirmCustom = ({
  children,
  onConfirm,
  onCancel,
  submitButtonLabel,
  testId,
}: DialogConfirmCustomProps) => {
  return (
    <section>
      <section className="mb-8">{children}</section>
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
