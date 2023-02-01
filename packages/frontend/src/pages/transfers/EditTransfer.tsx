import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TransferForm } from './TransferForm';

import {
  UpdateTransferDto,
  useTransfersFindOneQuery,
  useTransfersUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const EditTransfer = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'missing-id' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);

  const transferData = useTransfersFindOneQuery({ id });
  const { data: transfer } = transferData;
  const [editTransaction, { isLoading: isSaving }] =
    useTransfersUpdateMutation();

  const handleSubmit = async (targetTransferData: UpdateTransferDto) => {
    if (!id) {
      console.error('Failed to edit transfer: no id');
      return;
    }
    try {
      const newTransactionJson = await editTransaction({
        updateTransferDto: targetTransferData,
        id,
      }).unwrap();

      if ('message' in newTransactionJson) {
        setErrors(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parseErrorMessagesToArray((newTransactionJson as any).message)
        );
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
      {isSaving && <LoaderFullScreen />}
      <DataHandler {...transferData} />
      <UpdatePageInfo title="Edit transfer" />
      {transfer && (
        <TransferForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Update"
          amount={transfer.amount}
          date={new Date(transfer.date)}
          description={transfer.description}
          fromAccount={transfer.fromAccount}
          toAccount={transfer.toAccount}
          transactionCategoryMapping={transfer.categories}
        />
      )}
    </>
  );
};
