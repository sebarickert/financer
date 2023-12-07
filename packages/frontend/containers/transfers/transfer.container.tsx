import { useCallback } from 'react';

import {
  useTransfersFindOneQuery,
  useAccountsFindOneByIdQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { Transfer } from '$pages/transfers/transfer';

interface TransferContainerProps {
  id: string;
}

export const TransferContainer = ({ id }: TransferContainerProps) => {
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

  const getCategoryNameById = useCallback(
    (categoryId: string) =>
      transactionCategories?.find((category) => category._id === categoryId)
        ?.categoryTree || categoryId,
    [transactionCategories]
  );

  return (
    <>
      <DataHandler {...transferData} />
      {transfer && (
        <Transfer
          transfer={transfer}
          fromAccountName={fromAccount?.name}
          toAccountName={toAccount?.name}
          getCategoryNameById={getCategoryNameById}
        />
      )}
    </>
  );
};
