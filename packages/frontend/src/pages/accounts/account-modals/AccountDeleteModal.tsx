import { ModalConfirm } from '../../../components/modal/confirm/modal.confirm';

interface IAccountDeleteModalProps {
  handleDelete(): void;
}

export const AccountDeleteModal = ({
  handleDelete,
}: IAccountDeleteModalProps) => (
  <ModalConfirm
    label="Delete account"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete account"
    accentColor="red"
  >
    Are you sure you want to delete your account? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);
