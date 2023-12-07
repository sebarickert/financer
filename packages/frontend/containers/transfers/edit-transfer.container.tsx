import { useCallback, useState } from 'react';

import {
  UpdateTransferDto,
  useTransfersFindOneQuery,
  useTransfersRemoveMutation,
  useTransfersUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { EditTransfer } from '$pages/transfers/edit-transfer';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface EditTransferContainerProps {
  id: string;
}

export const EditTransferContainer = ({ id }: EditTransferContainerProps) => {
  const { push } = useViewTransitionRouter();
  const [errors, setErrors] = useState<string[]>([]);

  const transferData = useTransfersFindOneQuery({ id });
  const { data: transfer } = transferData;
  const [editTransfer, { isLoading: isSaving }] = useTransfersUpdateMutation();
  const [deleteTransfer] = useTransfersRemoveMutation();

  const handleSubmit = async (newTransferData: UpdateTransferDto) => {
    if (!id) {
      console.error('Failed to edit transfer: no id');
      return;
    }
    try {
      await editTransfer({
        updateTransferDto: newTransferData,
        id,
      }).unwrap();

      push('/statistics/transfers');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 404) {
        setErrors(parseErrorMessagesToArray(error?.data?.message));
        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const handleDelete = useCallback(async () => {
    if (!id) {
      console.error('Failed to delete transfer: no id');
      return;
    }
    await deleteTransfer({ id }).unwrap();
    push('/statistics/transfers');
  }, [deleteTransfer, id, push]);

  return (
    <>
      <DataHandler {...transferData} />
      {transfer && (
        <EditTransfer
          isLoading={isSaving}
          transfer={transfer}
          errors={errors}
          onSave={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
