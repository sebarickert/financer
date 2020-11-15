import React from "react";
import Modal from "../modal";
import ModalConfirmActions from "./modal.confirm.actions";
import ModalConfirmHeader from "./modal.confirm.header";

interface IProps {
  label: string;
  submitButtonLabel: string;
  children?: string;
}

const ModalConfirm = ({
  label,
  submitButtonLabel,
  children,
}: IProps): JSX.Element => {
  return (
    <Modal>
      <ModalConfirmHeader label={label}>{children}</ModalConfirmHeader>
      <ModalConfirmActions submitButtonLabel={submitButtonLabel} />
    </Modal>
  );
};

export default ModalConfirm;
