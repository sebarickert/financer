import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TransferForm } from './TransferForm';

import { UpdateTransferDto } from '$api/generated/financerApi';
import { useEditTransfer } from '$hooks/transfer/useEditTransfer';
import { useTransferById } from '$hooks/transfer/useTransferById';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const EditTransfer = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'missing-id' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);

  const transfer = useTransferById(id);
  const editTransaction = useEditTransfer();

  const handleSubmit = async (targetTransferData: UpdateTransferDto) => {
    if (!id) {
      console.error('Failed to edit transfer: no id');
      return;
    }
    try {
      const newTransactionJson = await editTransaction(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        targetTransferData as any,
        id
      );

      if ('message' in newTransactionJson) {
        setErrors(parseErrorMessagesToArray(newTransactionJson.message));
        return;
      }

      navigate('/statistics/transfers');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      <UpdatePageInfo title="Edit transfer" />
      <TransferForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Update"
        amount={transfer.amount}
        date={new Date(transfer.date)}
        description={transfer.description}
        fromAccount={transfer.fromAccount}
        toAccount={transfer.toAccount}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transactionCategoryMapping={transfer.categories as any}
      />
    </>
  );
};
