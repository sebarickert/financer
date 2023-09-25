import { useState } from 'react';

import {
  UpdateTransferDto,
  useTransfersFindOneQuery,
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
  return (
    <>
      <DataHandler {...transferData} />
      {transfer && (
        <EditTransfer
          isLoading={isSaving}
          transfer={transfer}
          errors={errors}
          onSave={handleSubmit}
        />
      )}
    </>
  );
};
