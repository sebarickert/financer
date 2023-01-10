import { useEffect } from 'react';

import {
  TransactionCategoryMappingDto,
  TransactionDto,
  TransactionsFindAllByUserApiArg,
  useExpensesFindAllByUserQuery,
  useIncomesFindAllByUserQuery,
  useTransactionsFindAllByUserQuery,
  useTransfersFindAllByUserQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { TransactionStackedList } from '$elements/transaction-stacked-list/transaction-stacked-list';
import {
  TransactionStackedListRowProps,
  TransactionType,
} from '$elements/transaction-stacked-list/transaction-stacked-list.row';
import { useTransactionCategoryName } from '$hooks/transactionCategories/useTransactionCategoryName';
import { usePager } from '$hooks/usePager';
import { formatCurrency } from '$utils/formatCurrency';
import { formatDate } from '$utils/formatDate';

type LatestTransactionsProps = {
  isPagerHidden?: boolean;
  filterOptions?: TransactionsFindAllByUserApiArg;
  className?: string;
  useDataHook?:
    | typeof useTransactionsFindAllByUserQuery
    | typeof useIncomesFindAllByUserQuery
    | typeof useExpensesFindAllByUserQuery
    | typeof useTransfersFindAllByUserQuery;
  onPageChange?: (page: number) => void;
  initialPage?: number;
};

export const getTransactionType = (
  toAccount: string | null | undefined,
  fromAccount: string | null | undefined
): TransactionType => {
  if (toAccount && !fromAccount) {
    return TransactionType.INCOME;
  }

  if (!toAccount && fromAccount) {
    return TransactionType.EXPENSE;
  }

  return TransactionType.TRANSFER;
};

export const mapTransactionTypeToUrlPrefix: {
  [key in TransactionType]: 'incomes' | 'expenses' | 'transfers';
} = {
  income: 'incomes',
  expense: 'expenses',
  transfer: 'transfers',
};

type TransactionDtoForConvert = Omit<
  TransactionDto,
  'fromAccount' | 'toAccount'
> & {
  fromAccount?: string;
  toAccount?: string;
};

export const convertTransactionToTransactionStackedListRow = (
  transaction: TransactionDtoForConvert,
  getCategoryName: (id: string) => string | undefined
): TransactionStackedListRowProps => {
  const transactionType = getTransactionType(
    transaction.toAccount,
    transaction.fromAccount
  );

  return {
    transactionCategories: (
      transaction.categories as unknown as TransactionCategoryMappingDto[]
    )
      .map(({ category_id }) =>
        getCategoryName(category_id as unknown as string)
      )
      .join(', '),
    transactionAmount: formatCurrency(transaction.amount),
    date: formatDate(new Date(transaction.date)),
    label: transaction.description,
    link: `/statistics/${mapTransactionTypeToUrlPrefix[transactionType]}/${transaction._id}`,
    transactionType,
    id: transaction._id,
  };
};

export const LatestTransactions = ({
  isPagerHidden,
  filterOptions = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  },
  className,
  useDataHook = useTransactionsFindAllByUserQuery,
  onPageChange,
  initialPage = 1,
}: LatestTransactionsProps): JSX.Element => {
  const getCategoryName = useTransactionCategoryName();
  const { page, getPagerOptions } = usePager(initialPage);
  const transactionData = useDataHook({ ...filterOptions, page } as any);
  const { data } = transactionData;

  useEffect(() => {
    if (onPageChange) {
      onPageChange(data?.currentPage ?? 1);
    }
  }, [onPageChange, data?.currentPage]);

  return (
    <>
      <DataHandler {...transactionData} />
      {data && (
        <TransactionStackedList
          rows={data?.data.map((transaction) =>
            convertTransactionToTransactionStackedListRow(
              transaction,
              getCategoryName
            )
          )}
          pagerOptions={{ ...getPagerOptions(data) }}
          className={className}
          isPagerHidden={isPagerHidden}
        />
      )}
    </>
  );
};
