import { TransactionDto } from '@local/types';
import { useEffect } from 'react';

import { useAllExpensesPaged } from '../../../hooks/expense/useAllExpenses';
import { useAllIncomesPaged } from '../../../hooks/income/useAllIncomes';
import { useAllTransactionsPaged } from '../../../hooks/transaction/useAllTransactions';
import { useTransactionCategoryName } from '../../../hooks/transactionCategories/useTransactionCategoryName';
import { useAllTransfersPaged } from '../../../hooks/transfer/useAllTransfers';
import { TransactionFilterOptions } from '../../../services/TransactionService';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { TransactionStackedList } from '../../elements/transaction-stacked-list/transaction-stacked-list';
import {
  TransactionStackedListRowProps,
  TransactionType,
} from '../../elements/transaction-stacked-list/transaction-stacked-list.row';

type LatestTransactionsProps = {
  isPagerHidden?: boolean;
  filterOptions?: TransactionFilterOptions;
  className?: string;
  useDataHook?:
    | typeof useAllTransactionsPaged
    | typeof useAllIncomesPaged
    | typeof useAllExpensesPaged
    | typeof useAllTransfersPaged;
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
    transactionCategories: transaction.categories
      .map(({ category_id }) => getCategoryName(category_id))
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
  useDataHook = useAllTransactionsPaged,
  onPageChange,
  initialPage = 1,
}: LatestTransactionsProps): JSX.Element => {
  const getCategoryName = useTransactionCategoryName();
  const { data, pagerOptions } = useDataHook(initialPage, filterOptions);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(pagerOptions.currentPage ?? 1);
    }
  }, [onPageChange, pagerOptions.currentPage]);

  return (
    <TransactionStackedList
      rows={data.data.map((transaction) =>
        convertTransactionToTransactionStackedListRow(
          transaction,
          getCategoryName
        )
      )}
      pagerOptions={pagerOptions}
      className={className}
      isPagerHidden={isPagerHidden}
    />
  );
};
