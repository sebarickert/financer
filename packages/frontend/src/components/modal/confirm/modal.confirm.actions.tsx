import { Button } from '../../button/button';
import { ButtonGroup } from '../../button/button.group';

interface IModalConfirmActionsProps {
  onCancel(): void;
  onConfirm(): void;
  submitButtonLabel: string;
  testId?: string;
}

export const ModalConfirmActions = ({
  onCancel,
  onConfirm,
  submitButtonLabel,
  testId,
}: IModalConfirmActionsProps): JSX.Element => {
  return (
    <ButtonGroup className="px-4 py-3 bg-gray-50 sm:px-6" isReverse>
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
  );
};
