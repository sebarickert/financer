import { useRouter } from 'next/router';
import { useCallback } from 'react';

import {
  useTransfersFindOneQuery,
  useAccountsFindOneByIdQuery,
  useTransfersRemoveMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { Transfer } from '$pages/transfers/transfer';

interface TransferContainerProps {
  id: string;
}

export const TransferContainer = ({ id }: TransferContainerProps) => {
  const { push } = useRouter();
  const transferData = useTransfersFindOneQuery({ id });
  const { data: transfer } = transferData;

  const fromAccountData = useAccountsFindOneByIdQuery(
    { id: transfer?.fromAccount as string },
    { skip: !transfer?.fromAccount }
  );
  const toAccountData = useAccountsFindOneByIdQuery(
    { id: transfer?.toAccount as string },
    { skip: !transfer?.toAccount }
  );
  const fromAccount = toAccountData.data;
  const toAccount = fromAccountData.data;

  const { data: transactionCategories } =
    useAllTransactionCategoriesWithCategoryTree();
  const [deleteTransfer, { isLoading: isDeleting }] =
    useTransfersRemoveMutation();

  const getCategoryNameById = useCallback(
    (categoryId: string) =>
      transactionCategories?.find((category) => category._id === categoryId)
        ?.categoryTree || categoryId,
    [transactionCategories]
  );

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
        <Transfer
          isLoading={isDeleting}
          transfer={transfer}
          fromAccountName={fromAccount?.name}
          toAccountName={toAccount?.name}
          onDelete={handleDelete}
          getCategoryNameById={getCategoryNameById}
        />
      )}
    </>
  );
};
