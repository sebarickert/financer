import {
  TransactionsFindAllByAccountApiArg,
  useTransactionsFindAllByAccountQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { convertTransactionToTransactionStackedListRow } from '$blocks/latest-transactions/latest-transactions';
import { TransactionStackedList } from '$elements/transaction-stacked-list/transaction-stacked-list';
import { useTransactionCategoryName } from '$hooks/transactionCategories/useTransactionCategoryName';
import { usePager } from '$hooks/usePager';

type LatestAccountTransactionsProps = {
  accountId: string;
  isPagerHidden?: boolean;
  filterOptions?: Omit<TransactionsFindAllByAccountApiArg, 'id' | 'page'>;
  className?: string;
};

export const LatestAccountTransactions = ({
  accountId,
  isPagerHidden,
  filterOptions = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  },
  className,
}: LatestAccountTransactionsProps): JSX.Element => {
  const getCategoryName = useTransactionCategoryName();
  const { page, getPagerOptions } = usePager(1);
  const transactionData = useTransactionsFindAllByAccountQuery({
    ...filterOptions,
    page,
    id: accountId,
  });
  const { data } = transactionData;

  return (
    <>
      <DataHandler {...transactionData} />
      {data && (
        <TransactionStackedList
          rows={data.data.map((transaction) =>
            convertTransactionToTransactionStackedListRow(
              transaction,
              getCategoryName
            )
          )}
          pagerOptions={getPagerOptions(data)}
          className={className}
          isPagerHidden={isPagerHidden}
        />
      )}
    </>
  );
};
