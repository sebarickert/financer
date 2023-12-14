import { ExpenseDto } from '@local/types';

import {
  TransactionListingItem,
  TransactionType,
} from '../../components/blocks/transaction-listing/transaction-listing.item';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export interface ExpenseDtoWithCategories extends ExpenseDto {
  categoryMappings: string[];
}

export interface ExpensesPerMonth {
  month: number;
  total: number;
  year: number;
  rows: TransactionListingItem[];
}

export const convertExpenseToTransactionStackedListRow = (
  expense: ExpenseDto,
  getCategoryName: (id: string) => string | undefined
): TransactionListingItem => ({
  transactionCategories: expense.categories
    .map(({ category_id }) => getCategoryName(category_id))
    .join(', '),
  transactionAmount: formatCurrency(expense.amount),
  date: formatDate(new Date(expense.date)),
  label: expense.description,
  link: `/statistics/expenses/${expense._id}`,
  transactionType: TransactionType.EXPENSE,
  id: expense._id,
});

export const groupExpensesByMonth = (
  dateStack: ExpensesPerMonth[],
  { _id, amount, date: dateRaw, description, ...rest }: ExpenseDtoWithCategories
): ExpensesPerMonth[] => {
  const date = new Date(dateRaw);
  const month = date.getMonth();
  const year = date.getFullYear();

  const { categoryMappings } = rest;

  const expense: TransactionListingItem = {
    transactionCategories: categoryMappings?.join(', '),
    transactionAmount: formatCurrency(amount),
    date: formatDate(date),
    label: description,
    link: `/statistics/expenses/${_id}`,
    transactionType: TransactionType.EXPENSE,
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
          ? [...stackRows, expense]
          : stackRows,
      })
    );
  }

  return dateStack.concat({
    year,
    month,
    total: amount,
    rows: [expense],
  });
};

export const sortExpenseStacksByMonth = (
  a: ExpensesPerMonth,
  b: ExpensesPerMonth
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

export const sortExpensesByDate = (
  stack: ExpensesPerMonth
): ExpensesPerMonth => {
  stack.rows.sort((a, b) =>
    new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1
  );

  return stack;
};
