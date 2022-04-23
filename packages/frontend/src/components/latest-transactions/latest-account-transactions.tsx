import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { useTransactionsByAccountIdPaged } from '../../hooks/transaction/useTransactionsByAccountId';
import { TransactionFilterOptions } from '../../services/TransactionService';

import { convertTransactionToTransactionStackedListRow } from './latest-transactions';

type LatestAccountTransactionsProps = {
  accountId: string;
  isPagerHidden?: boolean;
  filterOptions?: TransactionFilterOptions;
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
  const { data, pagerOptions } = useTransactionsByAccountIdPaged(
    accountId,
    1,
    filterOptions
  );

  return (
    <TransactionStackedList
      rows={data.data.map((transfer) =>
        convertTransactionToTransactionStackedListRow({
          ...transfer,
          categoryMappings: [],
        })
      )}
      pagerOptions={pagerOptions}
      className={className}
      isPagerHidden={isPagerHidden}
    />
  );
};
