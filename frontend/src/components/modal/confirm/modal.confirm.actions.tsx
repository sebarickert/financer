import React from "react";
import Button from "../../button/button";
import ButtonGroup from "../../button/button.group";

interface IProps {
  onCancel(): void;
  onConfirm(): void;
  submitButtonLabel: string;
}

const ModalConfirmActions = ({
  onCancel,
  onConfirm,
  submitButtonLabel,
}: IProps): JSX.Element => {
  return (
    <ButtonGroup className="bg-gray-50 px-4 py-3 sm:px-6" isReverse>
      <Button onClick={onConfirm} accentColor="red" size="small">
        {submitButtonLabel}
      </Button>
      <Button onClick={onCancel} accentColor="plain" size="small">
        Cancel
      </Button>
    </ButtonGroup>
  );
};

export default ModalConfirmActions;
