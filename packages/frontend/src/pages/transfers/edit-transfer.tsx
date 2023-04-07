import { useMemo } from 'react';

import { TransferForm } from './transfer-form';

import { TransferDto, UpdateTransferDto } from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { inputDateFormat } from '$utils/formatDate';

interface EditTransferProps {
  isLoading: boolean;
  transfer: TransferDto;
  errors: string[];
  onSave: (expense: UpdateTransferDto) => void;
}

export const EditTransfer = ({
  isLoading,
  transfer,
  errors,
  onSave,
}: EditTransferProps): JSX.Element => {
  const initialValues = useMemo(() => {
    if (!transfer) return undefined;

    return {
      ...transfer,
      date: inputDateFormat(new Date(transfer.date)),
    };
  }, [transfer]);

  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo title="Edit transfer" />
      {transfer && (
        <TransferForm
          onSubmit={onSave}
          errors={errors}
          submitLabel="Update"
          initialValues={initialValues}
        />
      )}
    </>
  );
};
