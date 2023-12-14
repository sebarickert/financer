import { TransferDto } from '@local/types';

import {
  TransactionListingItemProps,
  TransactionType,
} from '../../components/blocks/transaction-listing/transaction-listing.item';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface TransferDtoWithCategories extends TransferDto {
  categoryMappings: string[];
}

export interface TransfersPerMonth {
  month: number;
  total: number;
  year: number;
  rows: TransactionListingItemProps[];
}

export const convertTransferToTransactionStackedListRow = (
  transfer: TransferDto,
  getCategoryName: (id: string) => string | undefined
): TransactionListingItemProps => ({
  transactionCategories: transfer.categories
    .map(({ category_id }) => getCategoryName(category_id))
    .join(', '),
  transactionAmount: formatCurrency(transfer.amount),
  date: formatDate(new Date(transfer.date)),
  label: transfer.description,
  link: `/statistics/transfers/${transfer._id}`,
  transactionType: TransactionType.TRANSFER,
  id: transfer._id,
});

export const groupTransfersByMonth = (
  dateStack: TransfersPerMonth[],
  {
    _id,
    amount,
    date: dateRaw,
    description,
    ...rest
  }: TransferDtoWithCategories
): TransfersPerMonth[] => {
  const date = new Date(dateRaw);
  const month = date.getMonth();
  const year = date.getFullYear();

  const { categoryMappings } = rest;

  const transfer: TransactionListingItemProps = {
    transactionCategories: categoryMappings?.join(', '),
    transactionAmount: formatCurrency(amount),
    date: formatDate(date),
    label: description || 'plaa',
    link: `/statistics/transfers/${_id}`,
    transactionType: TransactionType.TRANSFER,
    id: _id,
  };

  const isMonthInDateStack = dateStack.some(
    ({ month: stackMonth, year: stackYear }) =>
      month === stackMonth && year === stackYear
  );

  if (isMonthInDateStack) {
    const isTargetMonthAndYear = (targetYear: number, targetMonth: number) =>
      targetYear === year && targetMonth === month;

    return dateStack.map(
      ({
        month: stackMonth,
        year: stackYear,
        total: stackTotal,
        rows: stackRows,
      }) => ({
        month: stackMonth,
        year: stackYear,
        total: isTargetMonthAndYear(stackYear, stackMonth)
          ? stackTotal + amount
          : stackTotal,
        rows: isTargetMonthAndYear(stackYear, stackMonth)
          ? [...stackRows, transfer]
          : stackRows,
      })
    );
  }

  return dateStack.concat({
    year,
    month,
    total: amount,
    rows: [transfer],
  });
};

export const sortIncomeStacksByMonth = (
  a: TransfersPerMonth,
  b: TransfersPerMonth
): 0 | 1 | -1 => {
  if (a.year > b.year) {
    return -1;
  }

  if (b.year > a.year) {
    return 1;
  }

  if (a.month > b.month) {
    return -1;
  }

  if (b.month > a.month) {
    return 1;
  }

  return 0;
};

export const sortIncomesByDate = (
  stack: TransfersPerMonth
): TransfersPerMonth => {
  stack.rows.sort((a, b) =>
    new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1
  );

  return stack;
};
