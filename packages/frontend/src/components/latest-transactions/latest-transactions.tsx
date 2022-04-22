import { TransactionDto } from '@local/types';

import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import {
  TransactionType,
  TransactionStackedListRowProps,
} from '../../components/transaction-stacked-list/transaction-stacked-list.row';
import { useAllTransactionsPaged } from '../../hooks/transaction/useAllTransactions';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

type LatestTransactionsProps = {
  isPagerHidden?: boolean;
  itemsOnPage?: number;
  className?: string;
};

interface TransactionDtoWithCategories extends TransactionDto {
  categoryMappings: string[];
}

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

export const convertTransactionToTransactionStackedListRow = (
  transaction: TransactionDtoWithCategories
): TransactionStackedListRowProps => {
  const transactionType = getTransactionType(
    transaction.toAccount,
    transaction.fromAccount
  );

  return {
    transactionCategories: transaction.categoryMappings?.join(', '),
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
  itemsOnPage,
  className,
}: LatestTransactionsProps): JSX.Element => {
  const now = new Date();
  const { data, pagerOptions } = useAllTransactionsPaged(1, {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    limit: itemsOnPage,
  });

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
